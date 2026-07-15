import type { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "error" | "warning" | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-gray-300",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  error: "bg-red-500/15 text-red-400 border-red-500/25",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  info: "bg-indigo-500/15 text-indigo-400 border-indigo-500/25",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border border-transparent ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
