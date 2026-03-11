import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-footer-bg text-footer-text">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section>
          <h3 className="text-lg font-bold text-white">Asegurat Ltda</h3>
          <p className="mt-2 text-sm text-white/85">
            Protegemos lo que más importa para ti y tu familia.
          </p>
        </section>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Navegación
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link href="/plans" className="hover:text-white">
                Ver planes
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:text-white">
                Ir a checkout
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Iniciar sesión
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Contacto
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>soporte@asegurat.co</li>
            <li>+57 300 123 4567</li>
            <li>Bogotá, Colombia</li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
