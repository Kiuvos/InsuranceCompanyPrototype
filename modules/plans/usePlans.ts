"use client";

import { useMemo, useState } from "react";
import mockPlans from "@/mocks/plans.json";
import { InsuranceType, Plan } from "@/types/plan";

const ALL_PLANS = mockPlans as Plan[];

export function usePlans() {
  const [selectedType, setSelectedType] = useState<InsuranceType | "todos">(
    "todos",
  );

  const filteredPlans = useMemo(() => {
    if (selectedType === "todos") return ALL_PLANS;
    return ALL_PLANS.filter((plan) => plan.type === selectedType);
  }, [selectedType]);

  return {
    plans: ALL_PLANS,
    filteredPlans,
    loading: false,
    error: null,
    selectedType,
    setSelectedType,
  };
}
