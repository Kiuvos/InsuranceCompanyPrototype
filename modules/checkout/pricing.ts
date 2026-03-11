import { PaymentPeriodicity, Plan } from "@/types/plan";

export interface PricingBreakdown {
  subtotal: number;
  taxes: number;
  total: number;
}

export function getPlanPriceByPeriodicity(
  basePrice: number,
  periodicity: PaymentPeriodicity,
): number {
  if (periodicity === "anual") {
    return basePrice * 12;
  }

  return basePrice;
}

export function getPricingBreakdown(
  plan: Plan,
  periodicity: PaymentPeriodicity,
): PricingBreakdown {
  const subtotal = getPlanPriceByPeriodicity(plan.basePrice, periodicity);
  const taxes = 0;
  const total = subtotal;

  return {
    subtotal,
    taxes,
    total,
  };
}

export function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}
