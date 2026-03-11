"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanCard } from "@/components/PlanCard";
import { PriceSimulator } from "@/components/PriceSimulator";

import { PaymentPeriodicity, Plan } from "@/types/plan";
import { usePlans } from "@/modules/plans/usePlans";

export default function PlansPage() {
  const router = useRouter();
  const { filteredPlans, loading, error, selectedType, setSelectedType } =
    usePlans();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [periodicity, setPeriodicity] = useState<PaymentPeriodicity>("mensual");

  const summaryText = useMemo(() => {
    if (!selectedPlan) {
      return "Selecciona un plan para ver el resumen en tiempo real";
    }

    return `${selectedPlan.name} (${selectedPlan.type}) - frecuencia ${periodicity}`;
  }, [periodicity, selectedPlan]);

  const onContinue = () => {
    if (!selectedPlan) return;
    router.push(
      `/checkout?planId=${selectedPlan.id}&periodicity=${periodicity}`,
    );
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header>
        <h1 className="title-primary text-3xl">Planes de seguros</h1>
        <p className="mt-2 text-slate-600">
          Compara coberturas y simula tu plan en tiempo real.
        </p>
      </header>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-700">
          Filtrar por tipo de seguro
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { value: "todos", label: "Todos" },
            { value: "vida", label: "Vida" },
            { value: "salud", label: "Salud" },
            { value: "hogar", label: "Hogar" },
            { value: "vehiculo", label: "Vehículo" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSelectedType(item.value as typeof selectedType)}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                selectedType === item.value
                  ? "bg-brand text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-600">Cargando planes...</p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {!loading && filteredPlans.length === 0 ? (
            <p className="text-sm text-slate-600">
              No hay planes para este filtro.
            </p>
          ) : null}
          {filteredPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="title-primary text-base">Resumen dinámico</h2>
            <p className="mt-2 text-sm text-slate-600">{summaryText}</p>
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
