"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlans, processCheckout } from "@/services/api";
import { formatCOP, getPricingBreakdown } from "@/modules/checkout/pricing";
import {
  CheckoutPersonalData,
  DeclarationData,
  InsuranceType,
  PaymentPeriodicity,
  PlanExtraDataField,
  Plan,
} from "@/types/plan";

const steps = ["Confirmación del plan", "Datos personales", "Método de pago"];

export default function CheckoutPage() {
  const router = useRouter();

  // Texto de autorización de tratamiento de datos mejor traerlo desde el backend o un CMS en un caso real, pero para este prototipo lo dejamos hardcodeado aquí
  const habeasDataText = `Autorización para el tratamiento de datos personales 
La Ley 1581 de 2012 tiene como objetivo desarrollar el derecho constitucional de todas las personas a conocer, actualizar y rectificar la información que se haya recogido sobre ellas en bases de datos o archivos, así como proteger otros derechos relacionados con la intimidad, el buen nombre y el habeas data, según los artículos 15 y 20 de la Constitución Política de Colombia.
Al marcar esta casilla, autorizo de manera previa, expresa e informada a ASEGURAT LTDA para recolectar, almacenar, usar, circular y suprimir mis datos personales con las siguientes finalidades:

1. Gestionar la cotización, emisión y administración de pólizas de seguro.
2. Verificar mi identidad y validar la información suministrada.
3. Contactarme por canales físicos o digitales para confirmar la compra y atender solicitudes.
4. Cumplir obligaciones legales y regulatorias aplicables en Colombia.
5. Enviarme información relacionada con el servicio contratado y novedades del producto.

Como titular de los datos, conozco que puedo ejercer mis derechos de acceso, actualización, rectificación y supresión, así como revocar esta autorización cuando sea procedente, escribiendo a soporte@asegurat.co.

Esta autorización se entiende otorgada únicamente para fines demostrativos dentro de este prototipo.`;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedInsuranceType, setSelectedInsuranceType] =
    useState<InsuranceType | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [planId, setPlanId] = useState("");
  const [periodicity, setPeriodicity] = useState<PaymentPeriodicity>("mensual");
  const [paymentMethod, setPaymentMethod] = useState<"tarjeta" | "pse">(
    "tarjeta",
  );
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [personalData, setPersonalData] = useState<CheckoutPersonalData>({
    fullName: "",
    documentType: "",
    documentNumber: "",
    birthDate: "",
    occupation: "",
    maritalStatus: "",
    address: "",
    email: "",
    city: "",
    phone: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [pseBank, setPseBank] = useState("");
  const [extraDataValues, setExtraDataValues] = useState<
    Record<string, string>
  >({});
  const [declarationData, setDeclarationData] = useState<DeclarationData>({
    weight: "",
    height: "",
    diagnosedDiseaseLastFiveYears: "",
    scheduledSurgeryNextSixMonths: "",
    underTreatmentOrMedication: "",
  });
  const [habeasDataAccepted, setHabeasDataAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showHabeasDataModal, setShowHabeasDataModal] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPlanId = urlParams.get("planId") ?? "";
      const queryInsuranceTypeRaw = urlParams.get("insuranceType");
      const queryPeriodicity =
        urlParams.get("periodicity") === "anual" ? "anual" : "mensual";
      const queryInsuranceType: InsuranceType | null =
        queryInsuranceTypeRaw === "vida" ||
        queryInsuranceTypeRaw === "billetera" ||
        queryInsuranceTypeRaw === "mascota"
          ? queryInsuranceTypeRaw
          : null;

      const data = await getPlans();
      const scopedPlans = queryInsuranceType
        ? data.filter((plan) => plan.type === queryInsuranceType)
        : data;
      const validQueryPlanId = scopedPlans.some(
        (plan) => plan.id === queryPlanId,
      )
        ? queryPlanId
        : "";

      setSelectedInsuranceType(queryInsuranceType);
      setPeriodicity(queryPeriodicity);
      setPlans(scopedPlans);
      setPlanId((prev) => prev || validQueryPlanId || scopedPlans[0]?.id || "");
    }

    loadPlans();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? null,
    [planId, plans],
  );
  const selectedPlanExtraDataFields = useMemo<PlanExtraDataField[]>(() => {
    return selectedPlan?.extraData ?? [];
  }, [selectedPlan]);

  const breakdown = useMemo(() => {
    if (!selectedPlan) return null;
    return getPricingBreakdown(selectedPlan, periodicity);
  }, [periodicity, selectedPlan]);

  const validateStep = () => {
    setError(null);

    if (step === 1 && selectedPlan?.declaration) {
      const {
        weight,
        height,
        diagnosedDiseaseLastFiveYears,
        scheduledSurgeryNextSixMonths,
        underTreatmentOrMedication,
      } = declarationData;

      if (
        !weight ||
        !height ||
        !diagnosedDiseaseLastFiveYears ||
        !scheduledSurgeryNextSixMonths ||
        !underTreatmentOrMedication
      ) {
        setError(
          "Completa la Declaración de Asegurabilidad antes de continuar",
        );
        return false;
      }
    }

    if (step === 2) {
      const {
        fullName,
        documentType,
        documentNumber,
        birthDate,
        occupation,
        maritalStatus,
        address,
        email,
        city,
        phone,
      } = personalData;
      const emailValid = /.+@.+\..+/.test(email);
      if (
        !fullName ||
        !documentType ||
        !documentNumber ||
        !birthDate ||
        !occupation ||
        !maritalStatus ||
        !address ||
        !email ||
        !city ||
        !phone
      ) {
        setError("Completa todos los datos personales antes de continuar");
        return false;
      }
      if (!emailValid) {
        setError("Ingresa un correo válido");
        return false;
      }

      if (selectedPlanExtraDataFields.length) {
        const missingField = selectedPlanExtraDataFields.find(
          (field) => !extraDataValues[field.key],
        );

        if (missingField) {
          setError(`Completa el campo ${missingField.label}`);
          return false;
        }
      }

      if (!habeasDataAccepted) {
        setError("Debes aceptar el tratamiento de datos (Habeas Data)");
        return false;
      }
    }

    if (step === 3) {
      if (paymentMethod === "tarjeta") {
        const complete =
          cardData.cardNumber &&
          cardData.cardName &&
          cardData.cardExpiry &&
          cardData.cardCvv;
        if (!complete) {
          setError("Completa los datos de tarjeta");
          return false;
        }
      }

      if (paymentMethod === "pse" && !pseBank) {
        setError("Selecciona un banco para PSE");
        return false;
      }

      if (!termsAccepted) {
        setError("Debes aceptar términos y condiciones");
        return false;
      }
    }

    return true;
  };

  const onNext = async () => {
    if (!validateStep()) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    if (!selectedPlan) {
      setError("Selecciona un plan para continuar");
      return;
    }

    setLoading(true);
    try {
      const response = await processCheckout({
        planId: selectedPlan.id,
        periodicity,
        paymentMethod,
        personalData,
        extraData: extraDataValues,
        declarationData: selectedPlan.declaration ? declarationData : undefined,
      });

      if (response.ok) {
        router.push(
          `/success_page?policy=${encodeURIComponent(response.policyNumber)}&receipt=${encodeURIComponent(response.receiptNumber)}&emailSent=${response.confirmationEmailSent}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    router.push("/plans");
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <h1 className="title-primary text-3xl">Checkout</h1>
        <p className="mt-2 text-slate-600">
          Completa tu compra en pocos pasos.
        </p>
      </header>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {steps.map((item, index) => {
          const active = step === index + 1;
          return (
            <li
              key={item}
              className={`rounded-md border px-4 py-3 text-sm font-semibold ${
                active
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              Paso {index + 1}: {item}
            </li>
          );
        })}
      </ol>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="title-primary text-xl">
                Paso 1: Confirmación del plan
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <select
                  value={planId}
                  onChange={(event) => setPlanId(event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                >
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>

                <select
                  value={periodicity}
                  onChange={(event) =>
                    setPeriodicity(event.target.value as PaymentPeriodicity)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                >
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>

              {selectedInsuranceType ? (
                <p className="text-sm text-slate-600">
                  Tipo seleccionado:
                  <strong>{" " + selectedInsuranceType + " "}</strong>
                  por favor lea con atención las condiciones del plan antes de
                  continuar con la compra.
                </p>
              ) : null}

              {selectedPlan && breakdown ? (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedPlan.image ? (
                    <img
                      src={selectedPlan.image}
                      alt={selectedPlan.name}
                      className="mb-3 h-40 w-full rounded-lg object-cover"
                    />
                  ) : null}

                  <p className="font-semibold text-slate-900">
                    {selectedPlan.name}
                  </p>
                  {selectedPlan.description ? (
                    <p className="mt-2 text-slate-600">
                      {selectedPlan.description}
                    </p>
                  ) : null}

                  <div className="mt-4 border-t border-slate-200 pt-3">
                    <p className="font-semibold text-slate-900">
                      ¿Qué incluye?
                    </p>
                    <ul className="mt-2 space-y-1">
                      {selectedPlan.coverages.map((coverage) => (
                        <li key={coverage}>• {coverage}</li>
                      ))}
                    </ul>

                    {selectedPlan.additionalBenefits?.length ? (
                      <>
                        <p className="mt-3 font-semibold text-slate-900">
                          Beneficios adicionales
                        </p>
                        <ul className="mt-2 space-y-1">
                          {selectedPlan.additionalBenefits.map((benefit) => (
                            <li key={benefit}>• {benefit}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}

                    {selectedPlan.officialLink ? (
                      <a
                        href={selectedPlan.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block text-sm font-medium text-brand underline hover:text-brand/80"
                      >
                        Más información en el sitio oficial de SEGUROS BOLÍVAR →
                      </a>
                    ) : null}

                    {selectedPlan.fullDescription ? (
                      <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                        {selectedPlan.fullDescription}
                      </p>
                    ) : null}

                    {selectedPlan.coverageDetails?.length ? (
                      <div className="mt-4">
                        <p className="font-semibold text-slate-900">
                          ¿Qué cubre?
                        </p>
                        <ol className="mt-2 space-y-2">
                          {selectedPlan.coverageDetails.map((item, idx) => (
                            <li
                              key={item.title}
                              className="text-sm text-slate-600"
                            >
                              <span className="font-semibold text-slate-800">
                                {idx + 1}. {item.title}:
                              </span>{" "}
                              {item.description}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}

                    {selectedPlan.exclusions?.length ? (
                      <div className="mt-4">
                        <p className="font-semibold text-slate-900">
                          ¿Qué NO cubre?
                        </p>
                        <ol className="mt-2 space-y-2">
                          {selectedPlan.exclusions.map((item, idx) => (
                            <li
                              key={item.title}
                              className="text-sm text-slate-600"
                            >
                              <span className="font-semibold text-slate-800">
                                {idx + 1}. {item.title}:
                              </span>{" "}
                              {item.description}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}

                    {selectedPlan.declaration ? (
                      <div className="mt-4">
                        <p className="mb-2 text-xs text-brand">
                          <strong>
                            Debes diligenciar la declaración para continuar al
                            siguiente paso.
                          </strong>
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowPlanModal(true)}
                          className="w-full rounded-md border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand hover:bg-brand/5 transition"
                        >
                          Ver Declaración de Asegurabilidad
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {showPlanModal && selectedPlan ? (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                  onClick={() => setShowPlanModal(false)}
                >
                  <div
                    className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setShowPlanModal(false)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 text-xl font-bold"
                    >
                      ✕
                    </button>

                    <h3 className="text-base font-bold uppercase tracking-wide text-slate-900 pr-8">
                      Declaración de Asegurabilidad
                    </h3>

                    {selectedPlan.declaration ? (
                      <div className="mt-3 rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 whitespace-pre-line">
                        {selectedPlan.declaration}
                      </div>
                    ) : null}

                    <div className="mt-4 rounded-lg border border-slate-200 p-4">
                      <h4 className="text-sm font-semibold text-slate-900">
                        Información de salud del asegurado
                      </h4>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">Peso (kg)</p>
                          <input
                            type="number"
                            min="1"
                            value={declarationData.weight}
                            onChange={(event) =>
                              setDeclarationData((prev) => ({
                                ...prev,
                                weight: event.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">
                            Estatura (cm)
                          </p>
                          <input
                            type="number"
                            min="1"
                            value={declarationData.height}
                            onChange={(event) =>
                              setDeclarationData((prev) => ({
                                ...prev,
                                height: event.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">
                            ¿Ha tenido enfermedad diagnosticada en los últimos 5
                            años?
                          </p>
                          <select
                            value={
                              declarationData.diagnosedDiseaseLastFiveYears
                            }
                            onChange={(event) =>
                              setDeclarationData((prev) => ({
                                ...prev,
                                diagnosedDiseaseLastFiveYears: event.target
                                  .value as "si" | "no" | "",
                              }))
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                          >
                            <option value="" disabled>
                              Selecciona una opción
                            </option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">
                            ¿Tiene alguna cirugía programada para los próximos 6
                            meses?
                          </p>
                          <select
                            value={
                              declarationData.scheduledSurgeryNextSixMonths
                            }
                            onChange={(event) =>
                              setDeclarationData((prev) => ({
                                ...prev,
                                scheduledSurgeryNextSixMonths: event.target
                                  .value as "si" | "no" | "",
                              }))
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                          >
                            <option value="" disabled>
                              Selecciona una opción
                            </option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">
                            ¿Está en tratamiento o toma algún medicamento?
                          </p>
                          <select
                            value={declarationData.underTreatmentOrMedication}
                            onChange={(event) =>
                              setDeclarationData((prev) => ({
                                ...prev,
                                underTreatmentOrMedication: event.target
                                  .value as "si" | "no" | "",
                              }))
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                          >
                            <option value="" disabled>
                              Selecciona una opción
                            </option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPlanModal(false)}
                      className="btn-primary mt-6 w-full"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                Paso 2: Datos personales
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Nombres y apellidos</p>
                  <input
                    value={personalData.fullName}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        fullName: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Tipo de documento</p>
                  <select
                    value={personalData.documentType}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        documentType: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    aria-placeholder="selecciona "
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="ce">Cédula de extranjería</option>
                    <option value="ti">Tarjeta de identidad</option>
                    <option value="pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Número de documento</p>
                  <input
                    value={personalData.documentNumber}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        documentNumber: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Fecha de nacimiento</p>
                  <input
                    value={personalData.birthDate}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        birthDate: event.target.value,
                      }))
                    }
                    type="date"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Ocupación</p>
                  <input
                    value={personalData.occupation}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        occupation: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Estado civil</p>
                  <select
                    value={personalData.maritalStatus}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        maritalStatus: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="soltero">Soltero</option>
                    <option value="casado">Casado</option>
                    <option value="union_libre">Unión libre</option>
                    <option value="divorciado">Divorciado</option>
                    <option value="viudo">Viudo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">
                    Dirección de domicilio
                  </p>
                  <input
                    value={personalData.address}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        address: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Correo electrónico</p>
                  <input
                    value={personalData.email}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                    type="email"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Ciudad</p>
                  <input
                    value={personalData.city}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        city: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Celular</p>
                  <input
                    value={personalData.phone}
                    onChange={(event) =>
                      setPersonalData((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
              </div>

              {selectedPlanExtraDataFields.length ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="text-base font-bold text-slate-900">
                    DATOS DE MASCOTA
                  </h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {selectedPlanExtraDataFields.map((field) => {
                      if (field.type === "select") {
                        return (
                          <div key={field.key} className="space-y-1">
                            <p className="text-xs text-slate-600">
                              {field.label}
                            </p>
                            <select
                              value={extraDataValues[field.key] ?? ""}
                              onChange={(event) =>
                                setExtraDataValues((prev) => ({
                                  ...prev,
                                  [field.key]: event.target.value,
                                }))
                              }
                              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                            >
                              <option value="" disabled>
                                Selecciona una opción
                              </option>
                              {(field.options ?? []).map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }

                      return (
                        <div key={field.key} className="space-y-1">
                          <p className="text-xs text-slate-600">
                            {field.label}
                          </p>
                          <input
                            type={field.type === "number" ? "number" : "text"}
                            value={extraDataValues[field.key] ?? ""}
                            onChange={(event) =>
                              setExtraDataValues((prev) => ({
                                ...prev,
                                [field.key]: event.target.value,
                              }))
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-start gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={habeasDataAccepted}
                    onChange={(event) =>
                      setHabeasDataAccepted(event.target.checked)
                    }
                    className="mt-1"
                  />
                  <span>
                    Acepto la autorización de tratamiento de datos personales.{" "}
                    <button
                      type="button"
                      onClick={() => setShowHabeasDataModal(true)}
                      className="font-semibold text-brand underline hover:text-brand-strong"
                    >
                      Leer autorización
                    </button>
                  </span>
                </label>
              </div>

              {showHabeasDataModal ? (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                  onClick={() => setShowHabeasDataModal(false)}
                >
                  <div
                    className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setShowHabeasDataModal(false)}
                      className="absolute right-4 top-4 text-xl font-bold text-slate-400 hover:text-slate-700"
                    >
                      ✕
                    </button>

                    <h3 className="pr-8 text-base font-bold uppercase tracking-wide text-slate-900">
                      Autorización de Tratamiento de Datos
                    </h3>

                    <div className="mt-3 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                      {habeasDataText}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowHabeasDataModal(false)}
                      className="btn-primary mt-6 w-full"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <h2 className="title-primary text-xl">Paso 3: Método de pago</h2>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("tarjeta")}
                  className={`rounded-md px-4 py-2 text-sm font-semibold ${
                    paymentMethod === "tarjeta"
                      ? "bg-brand text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Tarjeta débito/crédito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pse")}
                  className={`rounded-md px-4 py-2 text-sm font-semibold ${
                    paymentMethod === "pse"
                      ? "bg-brand text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  PSE
                </button>
              </div>

              {paymentMethod === "tarjeta" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Número de tarjeta</p>
                    <input
                      value={cardData.cardNumber}
                      onChange={(event) =>
                        setCardData((prev) => ({
                          ...prev,
                          cardNumber: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">Nombre del titular</p>
                    <input
                      value={cardData.cardName}
                      onChange={(event) =>
                        setCardData((prev) => ({
                          ...prev,
                          cardName: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">
                      Fecha de vencimiento
                    </p>
                    <input
                      value={cardData.cardExpiry}
                      onChange={(event) =>
                        setCardData((prev) => ({
                          ...prev,
                          cardExpiry: event.target.value,
                        }))
                      }
                      placeholder="MM/AA"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-600">CVV</p>
                    <input
                      value={cardData.cardCvv}
                      onChange={(event) =>
                        setCardData((prev) => ({
                          ...prev,
                          cardCvv: event.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">Banco</p>
                  <select
                    value={pseBank}
                    onChange={(event) => setPseBank(event.target.value)}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="bancolombia">Bancolombia</option>
                    <option value="davivienda">Davivienda</option>
                    <option value="bbva">BBVA</option>
                  </select>
                </div>
              )}

              <label className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => setTermsAccepted(event.target.checked)}
                  className="mt-1"
                />
                Acepto términos y condiciones para finalizar la compra.
              </label>

              <div className="rounded-md border border-brand/20 bg-brand/10 p-3 text-sm text-brand-strong">
                ¿Necesitas ayuda? Escríbenos a soporte@asegurat.co o llama al
                +57 300 123 4567.
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Volver
              </button>
            ) : null}

            <button
              type="button"
              onClick={onNext}
              disabled={loading}
              className="btn-primary px-5 py-2 disabled:opacity-60"
            >
              {loading
                ? "Procesando..."
                : step === 3
                  ? "Confirmar pago"
                  : "Continuar"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Cancelar compra
            </button>
          </div>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="title-primary text-lg">Resumen </h2>
          <h4 className="text-sm text-slate-700">
            Al continuar autoriza a ASEGURAT LTDA para hacer uso de sus datos
            conforme a la ley Ley 1581 de 2012.
          </h4>
          {selectedPlan && breakdown ? (
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                Plan: <strong>{selectedPlan.name}</strong>
              </p>
              <p>Tipo: {selectedPlan.type}</p>
              <p>Frecuencia: {periodicity}</p>
              <p>
                Valor (impuestos incluidos): {formatCOP(breakdown.subtotal)}
              </p>
              <p className="text-base font-bold text-slate-900">
                Total: {formatCOP(breakdown.total)}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-600">
              Selecciona un plan para ver el resumen.
            </p>
          )}

          <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <Link
              href="/plans"
              className="mt-2 inline-block font-semibold text-brand hover:text-brand-strong"
            >
              Cambiar Plan
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
