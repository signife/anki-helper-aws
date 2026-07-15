import { useTranslation } from "react-i18next";
import type { CardStatus } from "../../anki/types";

type FilterValue = CardStatus | "ALL" | "FAVORITES";

interface StatusFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
}

const filters: { value: FilterValue; labelKey: string }[] = [
  { value: "ALL", labelKey: "all" },
  { value: "READY", labelKey: "ready" },
  { value: "ADDED", labelKey: "addedFilter" },
  { value: "FAILED", labelKey: "failed" },
  { value: "FAVORITES", labelKey: "favorites" },
];

export default function StatusFilter({ value, onChange }: StatusFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-1">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 text-[12px] font-medium rounded-pill transition-colors ${
            value === f.value
              ? "bg-accent text-white dark:bg-accent-dark"
              : "bg-canvas-alt dark:bg-dark-surface-2 text-ink-muted dark:text-on-dark-muted hover:text-ink dark:hover:text-on-dark"
          }`}
        >
          {t(f.labelKey)}
        </button>
      ))}
    </div>
  );
}

export type { FilterValue };
