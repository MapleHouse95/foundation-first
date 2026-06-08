import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PageBreadcrumbItem = {
  label: string;
  to?: string;
};

export function PageBreadcrumb({
  items,
  className,
}: {
  items: PageBreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      className={cn("flex flex-wrap items-center gap-1.5 text-sm [word-break:keep-all]", className)}
      aria-label="breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
            ) : null}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="whitespace-nowrap font-semibold text-muted-foreground transition hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="whitespace-nowrap font-semibold text-foreground">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
