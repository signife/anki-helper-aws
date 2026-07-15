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
    <div className="flex items-center gap-3 p-3 mb-3 rounded-md border border-accent/20 bg-accent/5 dark:bg-accent-dark/5">
      <span className="text-[13px] text-ink-muted dark:text-on-dark-muted">
        {count} / {totalReady} selected
      </span>
      <div className="flex-1" />
      <Button variant="secondary" size="sm" onClick={clearSelection} disabled={isProcessing}>
        {t("cancel")}
      </Button>
      <Button size="sm" onClick={onAddSelected} loading={isProcessing}>
        {t("addSelected")}
      </Button>
    </div>
  );
}
