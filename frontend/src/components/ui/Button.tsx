import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-normal rounded-pill transition-all duration-150 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-hover active:scale-[0.97] dark:bg-accent-dark dark:hover:bg-accent",
    secondary:
      "bg-canvas-alt text-ink border border-hairline hover:bg-hairline/30 active:scale-[0.97] dark:bg-dark-surface-2 dark:text-on-dark dark:border-hairline-dark dark:hover:bg-dark-surface-3",
    text:
      "bg-transparent text-accent hover:underline dark:text-accent-dark p-0",
  };

  const sizes = {
    sm: "h-8 px-4 text-[14px]",
    md: "h-[44px] px-5 text-[17px]",
    lg: "h-[50px] px-7 text-[18px] font-light",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
}
