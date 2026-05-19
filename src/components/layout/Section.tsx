import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  containerClassName?: string;
  bleed?: boolean;
}

export function Section({
  className,
  eyebrow,
  title,
  description,
  containerClassName,
  bleed = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props}>
      {bleed ? (
        children
      ) : (
        <Container className={containerClassName}>
          {(eyebrow || title || description) && (
            <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
              {eyebrow && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-4 text-base text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          {children}
        </Container>
      )}
    </section>
  );
}