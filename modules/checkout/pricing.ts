import { PaymentPeriodicity, Plan } from "@/types/plan";

export const TAX_RATE = 0.19;

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
    const annualWithoutDiscount = basePrice * 12;
    const annualDiscount = annualWithoutDiscount * 0.08;
    return Math.round(annualWithoutDiscount - annualDiscount);
  }

  return basePrice;
}

export function getPricingBreakdown(
  plan: Plan,
  periodicity: PaymentPeriodicity,
): PricingBreakdown {
  const subtotal = getPlanPriceByPeriodicity(plan.basePrice, periodicity);
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

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
