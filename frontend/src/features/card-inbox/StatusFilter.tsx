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
    <div className="flex flex-wrap gap-1.5">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={`px-3 py-1.5 text-sm rounded-lg border transition ${
            value === f.value
              ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-300"
              : "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          {t(f.labelKey)}
        </button>
      ))}
    </div>
  );
}

export type { FilterValue };
