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
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setSide("front")}
          className={`flex-1 py-2.5 text-sm font-medium transition ${
            side === "front"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {t("front")}
        </button>
        <button
          onClick={() => setSide("back")}
          className={`flex-1 py-2.5 text-sm font-medium transition ${
            side === "back"
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {t("back")}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {side === "front" ? (
          <FrontSide card={card} />
        ) : (
          <BackSide card={card} />
        )}
      </div>
    </div>
  );
}

function FrontSide({ card }: { card: CardData }) {
  return (
    <div className="text-center space-y-3">
      <p className="text-3xl font-medium tracking-wide">{card.word}</p>
      <p className="text-sm text-gray-500">{card.reading}</p>
    </div>
  );
}

function BackSide({ card }: { card: CardData }) {
  const { t } = useTranslation();
  const isNative = card.cardMode === "jp-native";

  return (
    <div className="space-y-5">
      {/* Word + Reading */}
      <div className="text-center">
        <p className="text-2xl font-medium">{card.word}</p>
        <p className="text-sm text-indigo-400 mt-1">{card.reading}</p>
      </div>

      {/* Definition or Native */}
      <div className="text-center">
        <p className="text-lg">
          {isNative ? card.nativeMeaning : card.definition}
        </p>
      </div>

      {/* Examples */}
      {card.examples.length > 0 && (
        <Section title={t("examples")}>
          {card.examples.map((ex, i) => (
            <li
              key={i}
              className="text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeRubyHtml(ex) }}
            />
          ))}
        </Section>
      )}

      {/* Expressions */}
      {card.expressions.length > 0 && (
        <Section title={t("expressions")}>
          {card.expressions.map((exp, i) => (
            <li
              key={i}
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeRubyHtml(exp) }}
            />
          ))}
        </Section>
      )}

      {/* Synonyms */}
      {card.synonyms.length > 0 && (
        <Section title={t("synonyms")}>
          {card.synonyms.map((syn, i) => (
            <li key={i} className="text-sm">{syn}</li>
          ))}
        </Section>
      )}

      {/* Kanji */}
      {Object.keys(card.kanji).length > 0 && (
        <Section title={t("kanji")}>
          {Object.entries(card.kanji).map(([char, info]) => (
            <li key={char} className="text-sm">
              <span className="text-lg mr-2">{char}</span>
              <span className="text-gray-400">{info}</span>
            </li>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
        {title}
      </h4>
      <ul className="space-y-1.5">{children}</ul>
    </div>
  );
}
