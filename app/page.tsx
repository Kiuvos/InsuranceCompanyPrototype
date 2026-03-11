import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:px-6 lg:px-8">
          <p className="w-fit rounded-full bg-white/15 px-4 py-1 text-sm font-medium">
            Asegurat Ltda
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Protege lo que más importa
          </h1>
          <p className="max-w-xl text-lg text-white/90">
            Cotiza en minutos, personaliza tu cobertura y completa tu compra de
            forma simple y segura.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/plans"
              className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-white/90"
            >
              Cotiza ahora
            </Link>
            <Link
              href="/checkout"
              className="rounded-md border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ir al checkout
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="title-primary text-2xl">Tipos de seguros</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Vida", text: "Respaldo para tu familia en cada etapa." },
            {
              title: "Salud",
              text: "Atención médica y acompañamiento oportuno.",
            },
            {
              title: "Hogar",
              text: "Cobertura frente a daños y eventos inesperados.",
            },
            {
              title: "Vehículo",
              text: "Protección integral en cada trayecto.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="title-primary text-2xl">¿Por qué elegir Asegurat?</h2>
          <ul className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
            <li className="rounded-lg bg-white p-4">
              Atención 24/7 y soporte personalizado.
            </li>
            <li className="rounded-lg bg-white p-4">
              Cotización dinámica en pocos pasos.
            </li>
            <li className="rounded-lg bg-white p-4">
              Proceso digital con diseño intuitivo.
            </li>
            <li className="rounded-lg bg-white p-4">
              Respuesta inmediata para simulación de precios.
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="title-primary text-2xl">Testimonios</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            "“El proceso fue rápido y pude comparar planes fácilmente.”",
            "“La simulación de precio me ayudó a decidir sin complicaciones.”",
            "“Completé la compra desde mi celular en minutos.”",
          ].map((quote) => (
            <blockquote
              key={quote}
              className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700"
            >
              {quote}
            </blockquote>
          ))}
        </div>
      </section>
    </main>
  );
}
