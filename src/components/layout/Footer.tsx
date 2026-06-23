import { Container } from "./Container";
import { Logo } from "./Logo";

const placeholderLinks = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Contact", href: "#" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/70">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Calm, trustworthy home consultation for first-time renters and buyers.
          </p>
          <p className="text-xs text-muted-foreground">
            Support for overseas home search, inquiry, and reservation preparation.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {placeholderLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-disabled
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
      <div className="border-t border-border/60">
        <Container className="py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} MapleHouse · Responsive web service
        </Container>
      </div>
    </footer>
  );
}
