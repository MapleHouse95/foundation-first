import * as React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
  children,
  ...props
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}