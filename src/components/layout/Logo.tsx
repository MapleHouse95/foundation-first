import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" }: { to?: string }) {
  const [symbolFailed, setSymbolFailed] = useState(false);

  return (
    <Link to={to} className="flex shrink-0 items-center gap-2.5 text-foreground">
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-transparent text-primary"
      >
        {!symbolFailed ? (
          <img
            src="/brand/maplehouse-symbol.png"
            alt=""
            className="h-8 w-8 object-contain"
            onError={() => setSymbolFailed(true)}
          />
        ) : (
          <svg viewBox="0 0 28 28" className="h-7 w-7" fill="none" aria-hidden>
            <path
              d="M14 4.2 16 8l4.2-1.2-1.1 4 3.7 1.2-3.2 2.4 1.5 3.9-4.1-.6-1.4 4h-3.2l-1.4-4-4.1.6 1.5-3.9-3.2-2.4 3.7-1.2-1.1-4L12 8l2-3.8Z"
              fill="currentColor"
            />
            <path
              d="M9.2 14.3 14 10.8l4.8 3.5v6.9h-3.1v-4.1h-3.4v4.1H9.2v-6.9Z"
              fill="currentColor"
              fillOpacity="0.95"
            />
          </svg>
        )}
      </span>
      <span className="text-[15px] font-extrabold tracking-[0.08em] text-foreground">
        MAPLEHOUSE
      </span>
    </Link>
  );
}
