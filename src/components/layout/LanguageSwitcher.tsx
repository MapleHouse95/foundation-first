import { Link, useLocation } from "@tanstack/react-router";
import { LOCALES, LOCALE_LABELS, localeFromPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const current = localeFromPath(pathname);

  const swapPath = (target: Locale) => {
    if (!current) return `/${target}`;
    const rest = pathname.replace(/^\/(ko|en|fr)/, "");
    return `/${target}${rest || ""}`;
  };

  return (
    <div
      className={cn(
        "inline-flex flex-nowrap items-center gap-1 whitespace-nowrap rounded-md border border-border bg-background/60 px-1 py-1",
        className,
      )}
      role="group"
      aria-label="Language switcher"
    >
      <Languages className="ml-1 h-4 w-4 text-muted-foreground" aria-hidden />
      {LOCALES.map((loc) => (
        <Link
          key={loc}
          to={swapPath(loc)}
          className={cn(
            "whitespace-nowrap rounded px-2 py-1 text-xs font-medium transition-colors",
            current === loc
              ? "bg-accent text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
          aria-current={current === loc ? "true" : undefined}
        >
          {LOCALE_LABELS[loc]}
        </Link>
      ))}
    </div>
  );
}