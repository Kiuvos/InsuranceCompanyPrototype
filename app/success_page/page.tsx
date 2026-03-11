import Link from "next/link";

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

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4 py-10">
      <section className="w-full rounded-xl border border-brand/20 bg-brand/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">
          Compra exitosa
        </p>
        <h1 className="title-primary mt-2 text-3xl">
          Tu seguro quedó activo de forma provisional, Gracias por permitirnos
          proteger su futuro y el de su familia
        </h1>

        <div className="mt-5 space-y-2 rounded-lg bg-white p-4 text-sm text-slate-700">
          <p>
            Número de póliza provisional: <strong>{policy}</strong>
          </p>
          <p>
            Número de comprobante: <strong>{receipt}</strong>
          </p>
          <p>
            {emailSent
              ? "Correo de confirmación enviado. Nos estaremos comunicando contigo en las próximas 24 horas para finalizar el proceso."
              : "Ocurrió un error al enviar el correo, pendiente de envío."}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`data:text/plain;charset=utf-8,Comprobante%20${receipt}%20-%20Póliza%20${policy}`}
            download={`comprobante-${receipt}.txt`}
            className="btn-primary"
          >
            Descargar comprobante
          </a>

          <Link
            href="/"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
