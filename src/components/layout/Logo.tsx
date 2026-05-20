import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-foreground">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M12 2.4l1.45 3.3 3.3-1.1-.8 3.25 3.2.9-2.75 1.85 1.45 3.05-3.25-.45-.9 3.2h-2.4l-.9-3.2-3.25.45 1.45-3.05-2.75-1.85 3.2-.9-.8-3.25 3.3 1.1L12 2.4zm-1 14.9h2V22h-2z" />
        </svg>
      </span>
      <span className="text-[15px] font-bold tracking-[0.04em]">MAPLEHOUSE</span>
    </Link>
  );
}
