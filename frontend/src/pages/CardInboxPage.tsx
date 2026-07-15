import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../stores/auth-store";
import { WordInputForm } from "../features/card-generation";
import { CardList, StatusFilter, BatchActions } from "../features/card-inbox";
import { CardPreview } from "../features/card-preview";
import type { CardData, CardEntity } from "../anki/types";
import type { FilterValue } from "../features/card-inbox/StatusFilter";

export default function CardInboxPage() {
  const { t } = useTranslation();
  const { status } = useAuthStore();
  const isAuthenticated = status === "authenticated";
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [generatedCard, setGeneratedCard] = useState<CardData | null>(null);
  const [cards] = useState<CardEntity[]>([]);

  function handleCardGenerated(card: CardData) {
    setGeneratedCard(card);
  }

  return (
    <section className="space-y-8">
      {/* 비로그인 안내 */}
      {!isAuthenticated && (
        <div className="flex items-center gap-2.5 p-4 rounded-md border border-warning/30 bg-warning/5 text-[14px] text-warning">
          <span className="text-[16px]">⚠</span>
          <span>
            카드 저장 기능은 로그인 후 이용 가능합니다.{" "}
            <Link to="/login" className="underline font-medium">로그인</Link>
            {" / "}
            <Link to="/signup" className="underline font-medium">회원가입</Link>
          </span>
        </div>
      )}

      {/* 단어 입력 */}
      <div className="p-6 rounded-lg border border-hairline dark:border-hairline-dark bg-canvas dark:bg-dark-surface">
        <h2 className="text-[17px] font-semibold mb-4">{t("cardGeneration")}</h2>
        <WordInputForm onCardGenerated={handleCardGenerated} />
      </div>

      {/* 생성된 카드 미리보기 */}
      {generatedCard && (
        <div>
          <h2 className="text-[17px] font-semibold mb-3">{t("preview")}</h2>
          <CardPreview card={generatedCard} />
        </div>
      )}

      {/* 수집함 */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-[17px] font-semibold">{t("cards")}</h2>
          <StatusFilter value={filter} onChange={setFilter} />
        </div>

        <BatchActions
          totalReady={cards.filter((c) => c.status === "READY").length}
          onAddSelected={() => {}}
        />

        <CardList cards={cards} selectable={isAuthenticated} />
      </div>
    </section>
  );
}
