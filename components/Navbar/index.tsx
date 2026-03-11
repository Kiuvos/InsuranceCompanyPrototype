"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentSession, logoutUser } from "@/services/api";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/plans", label: "Planes" },
  { href: "/about_us", label: "Nosotros" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const session = getCurrentSession();
    setSessionEmail(session?.email ?? null);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logoutUser();
    setSessionEmail(null);
    setIsMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-extrabold text-brand">
          <img
            src="/AseguraT+-+Uso+en+Fondo+Blanco.jpg"
            alt="Asegurat"
            className="w-32"
          />
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          {!sessionEmail ? (
            <Link href="/login" className="transition hover:text-brand">
              Ingresar
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {sessionEmail ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="max-w-56 truncate rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand hover:text-brand"
              >
                Bienvenido, {sessionEmail}
              </button>

              {isMenuOpen ? (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sesión activa
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-700">
                    {sessionEmail}
                  </p>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand hover:text-brand"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          <Link href="/plans" className="btn-primary">
            Cotiza ahora
          </Link>
        </div>
      </div>
    </header>
  );
}
