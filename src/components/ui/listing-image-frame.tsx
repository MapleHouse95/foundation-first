import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ListingImageFrameProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  fit?: "cover" | "contain";
  fallback?: ReactNode;
  children?: ReactNode;
};

export function ListingImageFrame({
  src,
  alt,
  className,
  imageClassName,
  fit = "cover",
  fallback,
  children,
}: ListingImageFrameProps) {
  const [failed, setFailed] = useState(false);
  const shouldShowImage = Boolean(src) && !failed;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {shouldShowImage ? (
        <img
          src={src ?? ""}
          alt={alt}
          onError={() => setFailed(true)}
          className={cn(
            "block h-full w-full object-center",
            fit === "contain" ? "object-contain" : "object-cover",
            imageClassName,
          )}
        />
      ) : (
        fallback
      )}
      {children}
    </div>
  );
}
