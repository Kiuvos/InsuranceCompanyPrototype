import { SuccessPageDetails } from "@/components/SuccessPageDetails";

type SuccessPageProps = {
  searchParams?: Promise<{
    policy?: string;
    receipt?: string;
    emailSent?: string;
  }>;
};

export default async function ConfirmacionPage({
  searchParams,
}: SuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const policy = resolvedSearchParams?.policy ?? "POL-2026-000000";
  const receipt = resolvedSearchParams?.receipt ?? "RC-000000";
  const emailSent = resolvedSearchParams?.emailSent === "true";

  return <SuccessPageDetails policy={policy} receipt={receipt} emailSent={emailSent} />;
}
