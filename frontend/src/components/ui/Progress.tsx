interface ProgressProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

export default function Progress({ value, label, className = "" }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-400">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
