import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui";
import { useBatchStore } from "../../stores/batch-store";

interface BatchActionsProps {
  totalReady: number;
  onAddSelected: () => void;
}

export default function BatchActions({ totalReady, onAddSelected }: BatchActionsProps) {
  const { t } = useTranslation();
  const { selectedCardIds, clearSelection, isProcessing } = useBatchStore();
  const count = selectedCardIds.length;

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
      <span className="text-sm text-gray-300">
        {count} / {totalReady} selected
      </span>

      <div className="flex-1" />

      <Button variant="secondary" onClick={clearSelection} disabled={isProcessing}>
        {t("cancel")}
      </Button>

      <Button onClick={onAddSelected} loading={isProcessing}>
        {t("addSelected")}
      </Button>
    </div>
  );
}
