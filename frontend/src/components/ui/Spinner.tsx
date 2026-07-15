interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <svg
      className={`${sizes[size]} animate-spin text-accent dark:text-accent-dark ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" opacity="0.3" />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="60" strokeDashoffset="45" strokeLinecap="round" />
    </svg>
  );
}
