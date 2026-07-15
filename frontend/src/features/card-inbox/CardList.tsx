import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui";
import { useBatchStore } from "../../stores/batch-store";
import type { CardEntity, CardStatus } from "../../anki/types";

interface CardListProps {
  cards: CardEntity[];
  selectable?: boolean;
}

const statusVariant: Record<CardStatus, "info" | "success" | "error" | "default"> = {
  GENERATING: "info",
  READY: "default",
  FAILED: "error",
  ADDED: "success",
};

export default function CardList({ cards, selectable = false }: CardListProps) {
  const { t } = useTranslation();
  const { selectedCardIds, toggleCardSelection } = useBatchStore();

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[17px] text-ink-muted dark:text-on-dark-muted mb-1">{t("noCards")}</p>
        <p className="text-[14px] text-ink-faint dark:text-on-dark-muted">{t("noCardsDescription")}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-hairline dark:divide-hairline-dark border border-hairline dark:border-hairline-dark rounded-lg overflow-hidden">
      {cards.map((card) => {
        const isSelected = selectedCardIds.includes(card.cardId);

        return (
          <li
            key={card.cardId}
            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
              isSelected ? "bg-accent/5" : "bg-canvas dark:bg-dark-surface hover:bg-canvas-alt dark:hover:bg-dark-surface-2"
            }`}
          >
            {selectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCardSelection(card.cardId)}
                className="w-4 h-4 accent-accent shrink-0"
              />
            )}

            <Link to={`/cards/${card.cardId}`} className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-medium truncate">{card.word}</span>
                <span className="text-[14px] text-ink-faint dark:text-on-dark-muted">{card.reading}</span>
              </div>
              <p className="text-[13px] text-ink-muted dark:text-on-dark-muted truncate mt-0.5">
                {card.cardData.definition}
              </p>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              {card.favorite && <span className="text-warning text-[14px]">★</span>}
              <Badge variant={statusVariant[card.status]}>
                {card.status}
              </Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
