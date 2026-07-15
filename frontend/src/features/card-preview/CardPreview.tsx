import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { CardData } from "../../anki/types";
import { sanitizeRubyHtml } from "../../anki/card-builder";

interface CardPreviewProps {
  card: CardData;
}

export default function CardPreview({ card }: CardPreviewProps) {
  const { t } = useTranslation();
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div className="rounded-lg border border-hairline dark:border-hairline-dark overflow-hidden bg-canvas dark:bg-dark-surface">
      {/* Tabs */}
      <div className="flex border-b border-hairline dark:border-hairline-dark">
        <TabButton active={side === "front"} onClick={() => setSide("front")}>
          {t("front")}
        </TabButton>
        <TabButton active={side === "back"} onClick={() => setSide("back")}>
          {t("back")}
        </TabButton>
      </div>

      {/* Content */}
      <div className="p-6">
        {side === "front" ? <FrontSide card={card} /> : <BackSide card={card} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 text-[14px] font-medium transition-colors ${
        active
          ? "text-accent dark:text-accent-dark border-b-2 border-accent dark:border-accent-dark"
          : "text-ink-muted dark:text-on-dark-muted hover:text-ink dark:hover:text-on-dark"
      }`}
    >
      {children}
    </button>
  );
}

function FrontSide({ card }: { card: CardData }) {
  return (
    <div className="text-center py-8">
      <p className="text-[32px] font-medium tracking-wide">{card.word}</p>
      <p className="text-[14px] text-ink-faint dark:text-on-dark-muted mt-2">{card.reading}</p>
    </div>
  );
}

function BackSide({ card }: { card: CardData }) {
  const { t } = useTranslation();
  const isNative = card.cardMode === "jp-native";

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-[24px] font-medium">{card.word}</p>
        <p className="text-[14px] text-accent dark:text-accent-dark mt-1">{card.reading}</p>
      </div>

      <div className="text-center text-[17px] leading-[1.47]">
        {isNative ? card.nativeMeaning : card.definition}
      </div>

      {card.examples.length > 0 && (
        <Section title={t("examples")}>
          {card.examples.map((ex, i) => (
            <li key={i} className="text-[14px] leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeRubyHtml(ex) }} />
          ))}
        </Section>
      )}

      {card.expressions.length > 0 && (
        <Section title={t("expressions")}>
          {card.expressions.map((exp, i) => (
            <li key={i} className="text-[14px]" dangerouslySetInnerHTML={{ __html: sanitizeRubyHtml(exp) }} />
          ))}
        </Section>
      )}

      {card.synonyms.length > 0 && (
        <Section title={t("synonyms")}>
          {card.synonyms.map((syn, i) => (
            <li key={i} className="text-[14px]">{syn}</li>
          ))}
        </Section>
      )}

      {Object.keys(card.kanji).length > 0 && (
        <Section title={t("kanji")}>
          {Object.entries(card.kanji).map(([char, info]) => (
            <li key={char} className="text-[14px]">
              <span className="text-[20px] mr-2">{char}</span>
              <span className="text-ink-muted dark:text-on-dark-muted">{info}</span>
            </li>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-hairline dark:border-hairline-dark">
      <h4 className="text-[12px] uppercase tracking-wider text-ink-faint dark:text-on-dark-muted mb-2 font-medium">
        {title}
      </h4>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}
