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

const statusLabel: Record<CardStatus, string> = {
  GENERATING: "Generating",
  READY: "Ready",
  FAILED: "Failed",
  ADDED: "Added",
};

export default function CardList({ cards, selectable = false }: CardListProps) {
  const { t } = useTranslation();
  const { selectedCardIds, toggleCardSelection } = useBatchStore();

  if (cards.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg mb-2">{t("noCards")}</p>
        <p className="text-sm">{t("noCardsDescription")}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {cards.map((card) => {
        const isSelected = selectedCardIds.includes(card.cardId);

        return (
          <li
            key={card.cardId}
            className={`flex items-center gap-3 p-4 rounded-xl border transition ${
              isSelected
                ? "border-indigo-500/50 bg-indigo-500/5"
                : "border-white/10 bg-white/5 hover:bg-white/8"
            }`}
          >
            {selectable && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleCardSelection(card.cardId)}
                className="w-4 h-4 accent-indigo-500 shrink-0"
              />
            )}

            <Link
              to={`/cards/${card.cardId}`}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium truncate">
                  {card.word}
                </span>
                <span className="text-sm text-gray-500">{card.reading}</span>
              </div>
              <p className="text-sm text-gray-400 truncate mt-0.5">
                {card.cardData.definition}
              </p>
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              {card.favorite && (
                <span className="text-amber-400 text-sm">★</span>
              )}
              <Badge variant={statusVariant[card.status]}>
                {statusLabel[card.status]}
              </Badge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
