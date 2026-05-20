import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { NAV_LABELS, localeFromPath, type Locale } from "@/lib/i18n";

const CTA_LABEL: Record<Locale, string> = {
  ko: "무료 상담 신청",
  en: "Free consultation",
  fr: "Consultation gratuite",
};

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const isEntry = pathname === "/";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isEntry || isAdmin) {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Logo />
          {isAdmin && (
            <span className="text-xs font-medium text-muted-foreground">
              관리자 · 테스트 모드
            </span>
          )}
        </Container>
      </header>
    );
  }

  const navLinks = locale
    ? [
        { to: `/${locale}`, label: NAV_LABELS[locale].home, exact: true },
        { to: `/${locale}/listings`, label: NAV_LABELS[locale].listings, exact: false },
        { to: `/${locale}/apply`, label: NAV_LABELS[locale].apply, exact: false },
        { to: `/${locale}/landlords`, label: NAV_LABELS[locale].landlords, exact: false },
        { to: `/${locale}/contact`, label: NAV_LABELS[locale].contact, exact: false },
        { to: `/${locale}/about`, label: NAV_LABELS[locale].about, exact: false },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-3">
        <Logo />

        <nav className="hidden min-w-0 items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:text-sm"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: link.exact }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LanguageSwitcher />
          {locale && (
            <Button asChild size="sm">
              <Link to={`/${locale}/apply`}>{CTA_LABEL[locale]}</Link>
            </Button>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <div
        className={cn(
          "border-t border-border bg-card lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: link.exact }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3">
            <LanguageSwitcher />
          </div>
          {locale && (
            <Button asChild size="sm" className="mt-2">
              <Link to={`/${locale}/apply`} onClick={() => setOpen(false)}>
                {CTA_LABEL[locale]}
              </Link>
            </Button>
          )}
        </Container>
      </div>
    </header>
  );
}
