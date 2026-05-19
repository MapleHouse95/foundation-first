import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-foreground">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2l1.6 4.2 4.4.5-3.3 3 1 4.4L12 11.9 8.3 14.1l1-4.4-3.3-3 4.4-.5L12 2zm-1 14h2v6h-2z" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight">MapleHouse</span>
    </Link>
  );
}