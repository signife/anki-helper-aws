import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-canvas-alt text-ink-muted dark:bg-dark-surface-2 dark:text-on-dark-muted",
  success: "bg-success/10 text-success",
  error: "bg-error/10 text-error",
  warning: "bg-warning/10 text-warning",
  info: "bg-accent/10 text-accent dark:text-accent-dark",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-pill text-[12px] font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
