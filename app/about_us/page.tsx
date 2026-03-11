"use client";

import { FormEvent, useState } from "react";

export default function AboutUsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="title-primary text-3xl">Quiénes somos</h1>

        <div className="mt-5 space-y-4 text-slate-700">
          <p>
            En Asegurat Ltda, somos un equipo de profesionales comprometidos con
            tu bienestar. Con más de 10 años de experiencia en el sector
            asegurador, hemos construido una sólida reputación basada en la
            confianza y el servicio excepcional.
          </p>
          <p>
            Nuestra misión es brindarte soluciones de seguros integrales y
            personalizadas, adaptadas a sus necesidades y presupuesto. Nos
            apasiona proteger lo que más valoras, brindándole tranquilidad y
            seguridad en cada etapa de su vida.
          </p>
          <p>
            ¿Tienes dudas sobre qué seguro es el adecuado para ti? En Asegurat
            Ltda. te brindamos asesoría personalizada sin costo. Llama o
            escríbenos al <strong>301 123 4567</strong> o envíanos un correo a
            <strong> ventas@asegurat.co</strong> y uno de nuestros expertos te
            ayudará a encontrar la mejor opción para proteger lo que más te
            importa.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="title-primary text-2xl">Déjanos tu inquietud</h2>
        <p className="mt-2 text-sm text-slate-600">
          Completa el formulario y te contactaremos lo antes posible.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-5 grid gap-4 md:grid-cols-2"
        >
          <input
            required
            name="name"
            placeholder="Nombre completo"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <input
            required
            name="phone"
            placeholder="Teléfono"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="Correo electrónico"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand md:col-span-2"
          />
          <textarea
            required
            name="message"
            rows={5}
            placeholder="Cuéntanos tu inquietud"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand md:col-span-2"
          />
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary">
              Enviar solicitud
            </button>
          </div>
        </form>

        {submitted ? (
          <p className="mt-4 rounded-md bg-brand/10 px-3 py-2 text-sm text-brand-strong">
            Gracias por escribirnos. Un asesor de Asegurat se comunicará contigo
            pronto.
          </p>
        ) : null}
      </section>
    </main>
  );
}
