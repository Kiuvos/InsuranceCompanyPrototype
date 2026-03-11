export type InsuranceType = "vida" | "billetera" | "mascota";

export type PaymentPeriodicity = "mensual" | "anual";

export interface Plan {
  id: string;
  name: string;
  type: InsuranceType;
  description?: string;
  image?: string;
  extraData?: PlanExtraDataField[];
  basePrice: number;
  coverages: string[];
  additionalBenefits?: string[];
}

export interface PlanExtraDataField {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  options?: Array<{
    label: string;
    value: string;
  }>;
}

export interface CheckoutPersonalData {
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  occupation: string;
  maritalStatus: string;
  address: string;
  email: string;
  city: string;
  phone: string;
}

export interface CheckoutPayload {
  planId: string;
  periodicity: PaymentPeriodicity;
  paymentMethod: "tarjeta" | "pse";
  personalData: CheckoutPersonalData;
  extraData?: Record<string, string>;
}

export interface CheckoutResponse {
  ok: boolean;
  policyNumber: string;
  receiptNumber: string;
  confirmationEmailSent: boolean;
}
