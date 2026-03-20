"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const insuranceTypes = [
    {
      title: "Seguro de Vida",
      image: "/insurance/vida.png",
      description:
        "Protege el bienestar económico de tu familia frente a situaciones inesperadas. Este seguro brinda respaldo financiero en caso de fallecimiento, enfermedad grave o incapacidad.",
      extra:
        "Con nuestros planes puedes elegir diferentes niveles de cobertura según tus necesidades y presupuesto.",
      benefits: [
        "Respaldo económico para tu familia",
        "Cobertura ante enfermedades graves",
        "Protección ante incapacidad o fallecimiento",
        "Planes flexibles que se adaptan a tu presupuesto",
      ],
    },
    {
      title: "Protección de Billetera",
      image: "/insurance/billetera.png",
      description:
        "La pérdida o robo de documentos y tarjetas puede generar grandes inconvenientes. Con este seguro obtienes respaldo frente a fraude, pérdida de documentos o robo de pertenencias esenciales.",
      extra:
        "Este seguro te permite actuar con rapidez y contar con apoyo cuando más lo necesitas.",
      benefits: [
        "Cobertura ante robo o pérdida de documentos",
        "Protección contra fraude en tarjetas",
        "Apoyo en situaciones inesperadas",
        "Tranquilidad para tu día a día",
      ],
    },
    {
      title: "Seguro para Mascotas",
      image: "/insurance/mascota.webp",
      description:
        "Tu mascota es parte de tu familia y merece el mejor cuidado. Este seguro está diseñado para proteger su bienestar y ayudarte a cubrir gastos veterinarios o situaciones imprevistas.",
      extra:
        "Con diferentes niveles de cobertura, puedes elegir el plan que mejor se adapte a tu mascota y a tu presupuesto.",
      benefits: [
        "Cobertura para atención veterinaria",
        "Protección ante emergencias médicas",
        "Apoyo en situaciones inesperadas",
        "Cuidado integral para tu mascota",
      ],
    },
  ];

  const valueProps = [
    {
      image: "/landing/rapidez.jpg",
      title: "Proceso rápido y 100% digital",
      text: "Simula tu seguro, elige el plan que mejor se adapte a ti y completa tu compra en pocos minutos desde cualquier dispositivo.",
    },
    {
      image: "/landing/respaldo.jpg",
      title: "Respaldo cuando más lo necesitas",
      text: "Nuestros planes están diseñados para ayudarte en momentos difíciles, brindando apoyo económico y protección ante eventos inesperados.",
    },
    {
      image: "/landing/flexibility.jpg",
      title: "Flexibilidad para elegir tu plan",
      text: "Cada persona tiene necesidades distintas. Por eso puedes elegir entre diferentes niveles de cobertura y adaptar el seguro a lo que realmente necesitas proteger.",
    },
  ];

  const testimonials = [
    {
      name: "Laura Gómez",
      type: "Seguro de Vida",
      avatar: "https://i.pravatar.cc/96?img=32",
      quote:
        "Me gustó mucho lo fácil que fue contratar el seguro. En pocos minutos pude elegir el plan que mejor se ajustaba a lo que necesitaba para proteger a mi familia.",
    },
    {
      name: "Carlos Ramírez",
      type: "Protección de Billetera",
      avatar: "https://i.pravatar.cc/96?img=12",
      quote:
        "Una vez perdí mi billetera y fue una experiencia muy estresante. Tener este seguro me da tranquilidad porque sé que tengo respaldo si vuelve a pasar.",
    },
    {
      name: "Andrea Morales",
      type: "Seguro para Mascotas",
      avatar: "https://i.pravatar.cc/96?img=47",
      quote:
        "Mi perro es parte de mi familia y este seguro me da mucha tranquilidad. Saber que puedo contar con apoyo para gastos veterinarios es algo que valoro mucho.",
    },
    {
      name: "Daniel Torres",
      type: "Seguro de Vida",
      avatar: "https://i.pravatar.cc/96?img=15",
      quote:
        "El proceso fue muy rápido y claro. Pude comparar planes fácilmente y elegir el que mejor se adaptaba a mi presupuesto.",
    },
    {
      name: "Valentina Rojas",
      type: "Protección de Billetera",
      avatar: "https://i.pravatar.cc/96?img=41",
      quote:
        "Me sorprendió lo sencillo que fue todo. La plataforma es muy fácil de usar y en pocos pasos ya tenía mi seguro.",
    },
    {
      name: "Santiago Herrera",
      type: "Seguro para Mascotas",
      avatar: "https://i.pravatar.cc/96?img=53",
      quote:
        "Contraté el seguro para mi mascota y me pareció una excelente opción. Es bueno saber que tengo respaldo ante cualquier imprevisto.",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(3);
  const extended = [...testimonials, ...testimonials.slice(0, visibleCount)];
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const syncVisibleCount = () => {
      const nextVisibleCount = window.innerWidth < 768 ? 1 : 3;
      setVisibleCount(nextVisibleCount);
      setIdx(0);
      setAnimating(false);
      requestAnimationFrame(() => setAnimating(true));
    };

    syncVisibleCount();
    window.addEventListener("resize", syncVisibleCount);

    return () => {
      window.removeEventListener("resize", syncVisibleCount);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setIdx((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (idx >= testimonials.length) {
      setAnimating(false);
      setIdx((prev) => prev - testimonials.length);
      requestAnimationFrame(() => setAnimating(true));
    }
  };

  const goTo = (newIdx: number) => {
    setAnimating(true);
    setIdx(newIdx);
  };

  const dotIdx = idx % testimonials.length;

  return (
    <main>
      <section className="bg-brand text-white pb-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div className="flex flex-col gap-6">
            <p className="w-fit rounded-full bg-white/15 px-4 py-1 text-sm font-medium">
              Asegurat Ltda
            </p>
            <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Protege lo que más importa en tu vida.
            </h1>
            <p className="max-w-xl text-lg text-white/90">
              Seguros simples, rápidos y diseñados para tu tranquilidad. Cotiza
              tu seguro en menos de 2 minutos.
            </p>
            <p className="max-w-3xl text-base text-white/85">
              Contrata seguros de vida, protección para tu billetera o cobertura
              para tu mascota en minutos. Sin procesos complicados y con
              respaldo inmediato cuando más lo necesitas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/plans"
                className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-brand transition-all duration-200 hover:scale-[1.03] hover:bg-white/90"
              >
                Cotiza ahora
              </Link>
              <Link
                href="/checkout"
                className="rounded-md border border-white/50 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.03] hover:bg-white/10"
              >
                Ir al checkout
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-lg backdrop-blur-sm">
            <img
              src="/landing/banner_principal.jpg"
              alt="Familia protegida con seguros Asegurat"
              className="h-64 w-full object-cover sm:h-80 lg:h-[420px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="title-primary text-2xl">Tipos de seguros</h2>

        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand/10" />
          <img
            src="/landing/banner.png"
            alt="Banner promocional de Asegurat"
            className="relative block h-auto w-full max-w-full object-cover brightness-95 saturate-105 transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-105 group-hover:saturate-[1.2]"
            loading="lazy"
          />
        </div>

        <p className="mt-2 max-w-3xl text-slate-600">
          Encuentra el seguro que se adapta a lo que quieres proteger.
        </p>
        <p className="mt-3 max-w-4xl text-sm text-slate-600">
          Cada persona tiene necesidades diferentes. Por eso en Asegurat
          ofrecemos seguros diseñados para proteger lo que más valoras en tu
          vida. Elige el tipo de cobertura que mejor se adapte a ti y
          personaliza tu plan en pocos pasos.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {insuranceTypes.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
            >
              <div className="mb-4 overflow-hidden rounded-lg">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-36 w-full object-cover brightness-95 transition-all duration-300 hover:scale-105 hover:brightness-100"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              <p className="mt-3 text-sm text-slate-600">{item.extra}</p>

              <p className="mt-4 text-sm font-semibold text-slate-900">
                Beneficios principales:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {item.benefits.map((benefit) => (
                  <li key={benefit}>• {benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="title-primary text-2xl">
            Protección simple, rápida y pensada para ti
          </h2>
          <p className="mt-3 max-w-4xl text-sm text-slate-600">
            En Asegurat creemos que contratar un seguro no debería ser
            complicado. Por eso hemos creado una experiencia digital que te
            permite conocer, personalizar y contratar tu seguro de forma rápida
            y sencilla. Nuestro objetivo es brindarte tranquilidad y respaldo
            cuando realmente lo necesites.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((item) => (
              <article
                key={item.title}
                className="group rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-36 w-full object-cover brightness-95 transition-all duration-300 group-hover:scale-105 group-hover:brightness-100 pb-2"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-2 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand/10 via-transparent to-brand/10" />
          <img
            src="/landing/banner_horizontal.png"
            alt="Banner promocional de Asegurat"
            className="relative block h-auto w-full max-w-full object-cover brightness-95 saturate-105 transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-105 group-hover:saturate-[1.2]"
            loading="lazy"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="title-primary text-2xl">Testimonios</h2>

        <div className="mt-8 overflow-hidden">
          <div
            style={{
              display: "flex",
              width: `${(extended.length / visibleCount) * 100}%`,
              transform: `translateX(-${(idx * 100) / extended.length}%)`,
              transition: animating ? "transform 0.5s ease" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extended.map((item, i) => (
              <div
                key={i}
                style={{ width: `${100 / extended.length}%` }}
                className="px-2.5"
              >
                <article className="relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <img
                    src={item.avatar}
                    alt={`Foto de ${item.name}`}
                    className="absolute right-4 top-4 h-14 w-14 rounded-full border-2 border-white object-cover shadow"
                    loading="lazy"
                  />
                  <p className="pr-20 text-base text-yellow-400">⭐⭐⭐⭐⭐</p>
                  <p className="mt-2 pr-20 text-sm font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <p className="pr-20 text-xs font-medium text-brand">
                    {item.type}
                  </p>
                  <p className="mt-3 w-full text-center text-sm text-slate-600">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === dotIdx ? "bg-brand" : "bg-slate-300"
              }`}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
