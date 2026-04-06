"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PriceSimulator } from "@/components/PriceSimulator";

import { InsuranceType, PaymentPeriodicity, Plan } from "@/types/plan";
import { usePlans } from "@/modules/plans/usePlans";

const INSURANCE_LABELS: Record<InsuranceType, string> = {
  vida: "Seguro de Vida",
  billetera: "Póliza de Billetera",
  mascota: "Seguro de Mascota",
};

export default function PlansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { plans, loading, error } = usePlans();
  const summaryRef = useRef<HTMLElement | null>(null);
  const [selectedInsuranceType, setSelectedInsuranceType] =
    useState<InsuranceType | null>(null);
  const [periodicity, setPeriodicity] = useState<PaymentPeriodicity>("mensual");

  const insuranceCards = useMemo(() => {
    const grouped = plans.reduce(
      (accumulator, plan) => {
        accumulator[plan.type].push(plan);
        return accumulator;
      },
      {
        vida: [] as Plan[],
        billetera: [] as Plan[],
        mascota: [] as Plan[],
      },
    );

    return (Object.keys(grouped) as InsuranceType[])
      .map((type) => {
        const sortedByPrice = [...grouped[type]].sort(
          (left, right) => left.basePrice - right.basePrice,
        );
        const cheapestPlan = sortedByPrice[0] ?? null;

        return {
          type,
          title: INSURANCE_LABELS[type],
          description:
            cheapestPlan?.description ??
            "Protección diseñada para acompañarte cuando más lo necesitas.",
          image: cheapestPlan?.image,
          cheapestPlan,
        };
      })
      .filter((item) => item.cheapestPlan !== null);
  }, [plans]);

  const selectedPlan = useMemo(() => {
    if (!selectedInsuranceType) {
      return null;
    }

    return (
      insuranceCards.find((card) => card.type === selectedInsuranceType)
        ?.cheapestPlan ?? null
    );
  }, [insuranceCards, selectedInsuranceType]);

  const summaryText = useMemo(() => {
    if (!selectedPlan) {
      return "Selecciona un plan para ver el resumen en tiempo real";
    }

    return `${selectedPlan.name} - frecuencia ${periodicity}`;
  }, [periodicity, selectedPlan]);

  useEffect(() => {
    const queryInsuranceType = searchParams.get("insuranceType");
    if (
      queryInsuranceType === "vida" ||
      queryInsuranceType === "billetera" ||
      queryInsuranceType === "mascota"
    ) {
      setSelectedInsuranceType(queryInsuranceType);

      if (window.matchMedia("(max-width: 1023px)").matches) {
        requestAnimationFrame(() => {
          summaryRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    }
  }, [searchParams]);

  const onContinue = () => {
    if (!selectedPlan) return;
    router.push(
      `/checkout?insuranceType=${selectedPlan.type}&planId=${selectedPlan.id}&periodicity=${periodicity}`,
    );
  };

  const onSimulate = (type: InsuranceType) => {
    setSelectedInsuranceType(type);

    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => {
        summaryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <h1 className="title-primary text-3xl">Planes de seguros</h1>
        <p className="mt-2 text-slate-600">
          Elige el seguro que necesitas y empieza desde el plan más económico.
        </p>
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="min-w-0 grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-600">Cargando planes...</p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && insuranceCards.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hay planes disponibles en este momento.
            </p>
          ) : null}
          {insuranceCards.map((card) => (
            <article
              key={card.type}
              className="group card-surface w-full p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
            >
              {card.image ? (
                <div className="mb-4 overflow-hidden rounded-lg">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="h-36 w-full object-cover brightness-95 transition-all duration-300 group-hover:scale-105 group-hover:brightness-100"
                  />
                </div>
              ) : null}

              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <h3 className="min-w-0 text-lg font-bold text-slate-900">
                  {card.title}
                </h3>
                <span className="shrink-0 rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase text-brand">
                  Esencial
                </span>
              </div>

              <p className="text-sm text-slate-600">{card.description}</p>

              <p className="mt-4 text-sm font-semibold text-slate-800">
                Tu seguro desde
              </p>
              <p className="text-2xl font-extrabold text-brand">
                {new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  maximumFractionDigits: 0,
                }).format(card.cheapestPlan.basePrice)}
                <span className="ml-1 text-sm font-semibold text-slate-600">
                  / mes
                </span>
              </p>

              <button
                type="button"
                onClick={() => onSimulate(card.type)}
                className="btn-primary mt-5 w-full transition-all duration-200 hover:scale-[1.03]"
              >
                Simular
              </button>
            </article>
          ))}
        </div>

        <aside ref={summaryRef} className="min-w-0 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="title-primary text-base">Resumen dinámico</h2>
            <p className="mt-2 break-words text-sm text-slate-600">
              {summaryText}
            </p>
          </div>

          {selectedPlan ? (
            <PriceSimulator
              plan={selectedPlan}
              periodicity={periodicity}
              onPeriodicityChange={setPeriodicity}
              onContinue={onContinue}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
              Usa el botón “Simular” en una card para habilitar la cotización.
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
