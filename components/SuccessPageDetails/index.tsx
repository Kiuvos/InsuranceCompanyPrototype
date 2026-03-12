"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type SuccessPageDetailsProps = {
  policy: string;
  receipt: string;
  emailSent: boolean;
};

type LastPurchase = {
  extraData?: Record<string, string>;
};

const EXTRA_DATA_LABELS: Record<string, string> = {
  petName: "Nombre",
  petBreed: "Raza",
  petAge: "Edad",
  petColor: "Color",
  petVaccinated: "Vacunas",
};

function getReadableValue(key: string, value: string): string {
  if (key === "petVaccinated") {
    return value === "si" ? "Sí" : "No";
  }

  return value;
}

export function SuccessPageDetails({
  policy,
  receipt,
  emailSent,
}: SuccessPageDetailsProps) {
  const [extraData, setExtraData] = useState<Record<string, string>>({});

  useEffect(() => {
    const rawLastPurchase = window.localStorage.getItem(
      "asegurat_last_purchase",
    );
    if (!rawLastPurchase) {
      return;
    }

    try {
      const parsed = JSON.parse(rawLastPurchase) as LastPurchase;
      setExtraData(parsed.extraData ?? {});
    } catch {
      setExtraData({});
    }
  }, []);

  const extraDataEntries = useMemo(
    () => Object.entries(extraData).filter(([, value]) => Boolean(value)),
    [extraData],
  );

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

        {extraDataEntries.length ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <h2 className="text-base font-bold text-slate-900">
              Datos de mascota
            </h2>
            <ul className="mt-2 space-y-1">
              {extraDataEntries.map(([key, value]) => (
                <li key={key}>
                  <strong>{EXTRA_DATA_LABELS[key] ?? key}:</strong>{" "}
                  {getReadableValue(key, value)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
