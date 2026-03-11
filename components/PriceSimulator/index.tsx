"use client";

import { getPricingBreakdown, formatCOP } from "@/modules/checkout/pricing";
import { PaymentPeriodicity, Plan } from "@/types/plan";

interface PriceSimulatorProps {
  plan: Plan;
  periodicity: PaymentPeriodicity;
  onPeriodicityChange: (periodicity: PaymentPeriodicity) => void;
  onContinue: () => void;
}

export function PriceSimulator({
  plan,
  periodicity,
  onPeriodicityChange,
  onContinue,
}: PriceSimulatorProps) {
  const breakdown = getPricingBreakdown(plan, periodicity);

  return (
    <section className="rounded-xl border border-brand/20 bg-brand/10 p-5">
      <h3 className="title-primary text-lg">Simulación de precio</h3>
      <p className="mt-1 text-sm text-slate-600">
        Plan seleccionado: {plan.name}
      </p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onPeriodicityChange("mensual")}
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            periodicity === "mensual"
              ? "bg-brand text-white"
              : "bg-white text-slate-700"
          }`}
        >
          Mensual
        </button>
        <button
          type="button"
          onClick={() => onPeriodicityChange("anual")}
          className={`rounded-md px-4 py-2 text-sm font-semibold ${
            periodicity === "anual"
              ? "bg-brand text-white"
              : "bg-white text-slate-700"
          }`}
        >
          Anual
        </button>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-700">
        <div className="flex items-center justify-between">
          <dt>Valor (impuestos incluidos)</dt>
          <dd>{formatCOP(breakdown.subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-brand/20 pt-2 text-base font-bold text-slate-900">
          <dt>Total</dt>
          <dd>{formatCOP(breakdown.total)}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={onContinue}
        className="btn-primary mt-5 w-full"
      >
        Continuar
      </button>
    </section>
  );
}
