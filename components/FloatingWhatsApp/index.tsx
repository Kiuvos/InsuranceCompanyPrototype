export function FloatingWhatsApp() {
  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <a
        href="https://wa.me/message/MQ53PWIFXL3OC1"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactarse por WhatsApp"
        className="group relative flex items-center"
      >
        <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 opacity-0 shadow-md ring-1 ring-slate-200 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-1/2">
          Contactate con nosotros
        </span>

        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 group-hover:scale-105">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.55 0 .24 5.31.24 11.83c0 2.08.54 4.1 1.58 5.89L0 24l6.48-1.7a11.78 11.78 0 0 0 5.59 1.43h.01c6.52 0 11.83-5.31 11.83-11.83 0-3.16-1.23-6.12-3.39-8.42Zm-8.44 18.3h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.85 1.01 1.03-3.75-.24-.39a9.78 9.78 0 0 1-1.51-5.24c0-5.42 4.41-9.84 9.84-9.84a9.73 9.73 0 0 1 7.01 2.91 9.77 9.77 0 0 1 2.87 6.94c0 5.43-4.42 9.84-9.84 9.84Zm5.39-7.35c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.15-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.37-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.2-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.06 2.88 1.2 3.08c.15.2 2.09 3.18 5.07 4.46.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.56-.34Z" />
          </svg>
        </span>
      </a>
    </div>
  );
}
