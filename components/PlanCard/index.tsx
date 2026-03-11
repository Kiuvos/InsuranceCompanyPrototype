"use client";

import { formatCOP } from "@/modules/checkout/pricing";
import { Plan } from "@/types/plan";

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <article className="card-surface p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase text-brand">
          {plan.type}
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-700">
        Desde {formatCOP(plan.basePrice)} / mes
      </p>

      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {plan.coverages.map((coverage) => (
          <li
            key={coverage}
            title={coverage}
            className="rounded bg-slate-50 px-3 py-2"
          >
            {coverage}
          </li>
        ))}
      </ul>

      {plan.additionalBenefits?.length ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Beneficios adicionales
          </p>
          <ul className="space-y-1 text-sm text-slate-600">
            {plan.additionalBenefits.map((benefit) => (
              <li key={benefit}>• {benefit}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className="btn-primary mt-5 w-full"
      >
        Simular
      </button>
    </article>
  );
}
