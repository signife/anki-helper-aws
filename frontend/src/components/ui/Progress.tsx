interface ProgressProps {
  value: number;
  label?: string;
  className?: string;
}

export default function Progress({ value, label, className = "" }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex justify-between text-[13px] text-ink-muted dark:text-on-dark-muted">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-pill bg-canvas-alt dark:bg-dark-surface-2 overflow-hidden">
        <div
          className="h-full rounded-pill bg-accent dark:bg-accent-dark transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
