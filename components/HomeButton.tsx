import Link from "next/link";

export function HomeButton() {
  return (
    <Link
      href="/"
      className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 shadow-sm transition-colors hover:bg-zinc-700 active:bg-zinc-600"
      aria-label="Ir para o início"
    >
      {/* Ícone de Haltere */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-emerald-500"
      >
        <path d="M12 21a9.1 9.1 0 0 0-3.3-1.4l.2.8.2.8" />
        <path d="M12 3a9.1 9.1 0 0 0 3.3 1.4l-.2-.8-.2-.8" />
        <rect x="2" y="10" width="8" height="4" rx="1.5" />
        <rect x="14" y="10" width="8" height="4" rx="1.5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    </Link>
  );
}
