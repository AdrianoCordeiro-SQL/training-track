import Link from "next/link";

export function HomeButton() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Link
        href="/"
        className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700 shadow-md transition-colors hover:bg-zinc-700 active:bg-zinc-600"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-emerald-500"
        >
          <path d="M12 21a9.1 9.1 0 0 0-3.3-1.4l.2.8.2.8" />
          <path d="M12 3a9.1 9.1 0 0 0 3.3 1.4l-.2-.8-.2-.8" />
          <rect x="2" y="10" width="8" height="4" rx="1.5" />
          <rect x="14" y="10" width="8" height="4" rx="1.5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      </Link>
    </div>
  );
}
