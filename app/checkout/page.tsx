"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getPlans, processCheckout } from "@/services/api";
import { formatCOP, getPricingBreakdown } from "@/modules/checkout/pricing";
import { CheckoutPersonalData, PaymentPeriodicity, Plan } from "@/types/plan";

const steps = ["Datos personales", "Confirmación del plan", "Método de pago"];

export default function CheckoutPage() {
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
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
    documentId: "",
    email: "",
    phone: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });
  const [pseBank, setPseBank] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      const urlParams = new URLSearchParams(window.location.search);
      const queryPlanId = urlParams.get("planId") ?? "";
      const queryPeriodicity =
        urlParams.get("periodicity") === "anual" ? "anual" : "mensual";

      const data = await getPlans();
      setPeriodicity(queryPeriodicity);
      setPlans(data);
      setPlanId((prev) => prev || queryPlanId || data[0]?.id || "");
    }

    loadPlans();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? null,
    [planId, plans],
  );
  const breakdown = useMemo(() => {
    if (!selectedPlan) return null;
    return getPricingBreakdown(selectedPlan, periodicity);
  }, [periodicity, selectedPlan]);

  const validateStep = () => {
    setError(null);

    if (step === 1) {
      const { fullName, documentId, email, phone } = personalData;
      const emailValid = /.+@.+\..+/.test(email);
      if (!fullName || !documentId || !email || !phone) {
        setError("Completa todos los datos personales antes de continuar");
        return false;
      }
      if (!emailValid) {
        setError("Ingresa un correo válido");
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
              <h2 className="text-xl font-bold text-slate-900">
                Paso 1: Datos personales
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={personalData.fullName}
                  onChange={(event) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      fullName: event.target.value,
                    }))
                  }
                  placeholder="Nombre completo"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <input
                  value={personalData.documentId}
                  onChange={(event) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      documentId: event.target.value,
                    }))
                  }
                  placeholder="Documento"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <input
                  value={personalData.email}
                  onChange={(event) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  type="email"
                  placeholder="Correo electrónico"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <input
                  value={personalData.phone}
                  onChange={(event) =>
                    setPersonalData((prev) => ({
                      ...prev,
                      phone: event.target.value,
                    }))
                  }
                  placeholder="Teléfono"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-4">
              <h2 className="title-primary text-xl">
                Paso 2: Confirmación del plan
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
                  <option value="anual">Anual (-8%)</option>
                </select>
              </div>

              {selectedPlan && breakdown ? (
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    {selectedPlan.name}
                  </p>
                  <p className="mt-2">
                    Subtotal: {formatCOP(breakdown.subtotal)}
                  </p>
                  <p>Impuestos: {formatCOP(breakdown.taxes)}</p>
                  <p className="font-bold">
                    Total: {formatCOP(breakdown.total)}
                  </p>
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
                  <input
                    value={cardData.cardNumber}
                    onChange={(event) =>
                      setCardData((prev) => ({
                        ...prev,
                        cardNumber: event.target.value,
                      }))
                    }
                    placeholder="Número de tarjeta"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <input
                    value={cardData.cardName}
                    onChange={(event) =>
                      setCardData((prev) => ({
                        ...prev,
                        cardName: event.target.value,
                      }))
                    }
                    placeholder="Nombre del titular"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <input
                    value={cardData.cardExpiry}
                    onChange={(event) =>
                      setCardData((prev) => ({
                        ...prev,
                        cardExpiry: event.target.value,
                      }))
                    }
                    placeholder="MM/AA"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                  <input
                    value={cardData.cardCvv}
                    onChange={(event) =>
                      setCardData((prev) => ({
                        ...prev,
                        cardCvv: event.target.value,
                      }))
                    }
                    placeholder="CVV"
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>
              ) : (
                <select
                  value={pseBank}
                  onChange={(event) => setPseBank(event.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
                >
                  <option value="">Selecciona banco</option>
                  <option value="bancolombia">Bancolombia</option>
                  <option value="davivienda">Davivienda</option>
                  <option value="bbva">BBVA</option>
                </select>
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
          <h2 className="title-primary text-lg">Resumen en tiempo real</h2>
          {selectedPlan && breakdown ? (
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>
                Plan: <strong>{selectedPlan.name}</strong>
              </p>
              <p>Tipo: {selectedPlan.type}</p>
              <p>Frecuencia: {periodicity}</p>
              <p>Subtotal: {formatCOP(breakdown.subtotal)}</p>
              <p>Impuestos: {formatCOP(breakdown.taxes)}</p>
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
            <p>
              RNF de seguridad (fase real): HTTPS, encriptación y protección de
              datos.
            </p>
            <Link
              href="/plans"
              className="mt-2 inline-block font-semibold text-brand hover:text-brand-strong"
            >
              Modificar plan
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
