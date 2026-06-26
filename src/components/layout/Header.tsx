import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Languages, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";
import { NAV_LABELS, localeFromPath, type Locale } from "@/lib/i18n";

const LANGUAGE_LABEL: Record<Locale, string> = {
  ko: "언어 선택",
  en: "Language",
  fr: "Langue",
};

const LOGIN_LABEL: Record<Locale, string> = {
  ko: "로그인",
  en: "Login",
  fr: "Connexion",
};

const SIGNUP_LABEL: Record<Locale, string> = {
  ko: "회원가입",
  en: "Sign up",
  fr: "Inscription",
};

const CHECKLIST_MAIN_EVENT = "maplehouse:checklist-main";

function resetChecklistMainView() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CHECKLIST_MAIN_EVENT));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const locale = localeFromPath(pathname);
  const isEntry = pathname === "/";
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isListingsPage = /^\/(ko|en|fr)\/listings(?:\/|$)/.test(pathname);
  const logoTo = locale ? `/${locale}` : "/";

  if (isEntry || isAdmin) {
    return (
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <Logo to={logoTo} />
          {isAdmin && (
            <span className="text-xs font-medium text-muted-foreground">
              관리자
            </span>
          )}
        </Container>
      </header>
    );
  }

  const navLinks = locale
    ? [
        {
          to: `/${locale}/listings`,
          label: NAV_LABELS[locale].listings,
          exact: false,
          resetChecklist: false,
        },
        {
          to: `/${locale}/checklist`,
          label: NAV_LABELS[locale].checklist,
          exact: false,
          resetChecklist: true,
        },
        {
          to: `/${locale}/landlords`,
          label: NAV_LABELS[locale].landlords,
          exact: false,
          resetChecklist: false,
        },
        {
          to: `/${locale}/contact`,
          label: NAV_LABELS[locale].contact,
          exact: false,
          resetChecklist: false,
        },
        {
          to: `/${locale}/about`,
          label: NAV_LABELS[locale].about,
          exact: false,
          resetChecklist: false,
        },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div
        className={cn(
          "mx-auto grid h-16 grid-cols-[minmax(10rem,1fr)_auto] items-center gap-3 xl:grid-cols-[10.5rem_minmax(0,1fr)_20rem] xl:gap-5 2xl:grid-cols-[12rem_minmax(0,1fr)_21rem]",
          isListingsPage
            ? "w-full max-w-none px-4 sm:px-5 lg:px-6"
            : "w-[calc(100%-2rem)] max-w-[82rem] sm:w-[calc(100%-3rem)] xl:w-[calc(100%-4rem)]",
        )}
      >
        <div className="flex min-w-0 items-center justify-start">
          <Logo to={logoTo} />
        </div>

        <nav className="hidden min-w-0 items-center justify-center gap-2 overflow-hidden xl:flex 2xl:gap-2.5">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                if (link.resetChecklist) resetChecklistMainView();
              }}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-2.5 text-[12.5px] font-medium text-muted-foreground transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#FA7000] hover:text-white hover:shadow-sm focus-visible:bg-[#FA7000] focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FA7000] 2xl:px-3 2xl:text-[13px]"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: link.exact }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-0 items-center justify-end gap-2 xl:flex">
          {locale && (
            <>
              <Button asChild variant="outline" size="sm" className="min-w-[7rem] px-2.5">
                <Link to="/" className="gap-1.5">
                  <Languages className="h-4 w-4" />
                  {LANGUAGE_LABEL[locale]}
                </Link>
              </Button>
              <Button asChild variant="soft" size="sm" className="min-w-[5.5rem] px-2.5">
                <Link to={`/${locale}/login`}>{LOGIN_LABEL[locale]}</Link>
              </Button>
              <Button asChild size="sm" className="min-w-[6.25rem] px-2.5">
                <Link to={`/${locale}/signup`}>{SIGNUP_LABEL[locale]}</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-end rounded-md text-foreground xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-border bg-card xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                if (link.resetChecklist) resetChecklistMainView();
                setOpen(false);
              }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              activeOptions={{ exact: link.exact }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3">
            {locale && (
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/" onClick={() => setOpen(false)}>
                  <Languages className="h-4 w-4" />
                  {LANGUAGE_LABEL[locale]}
                </Link>
              </Button>
            )}
          </div>
          {locale && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button asChild variant="soft" size="sm">
                <Link to={`/${locale}/login`} onClick={() => setOpen(false)}>
                  {LOGIN_LABEL[locale]}
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link to={`/${locale}/signup`} onClick={() => setOpen(false)}>
                  {SIGNUP_LABEL[locale]}
                </Link>
              </Button>
            </div>
          )}
        </Container>
      </div>
    </header>
  );
}
