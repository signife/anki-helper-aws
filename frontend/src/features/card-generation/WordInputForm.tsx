import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "../../components/ui";
import { apiClient } from "../../lib/api/api-client";
import type { CardData } from "../../anki/types";

interface WordInputFormProps {
  onCardGenerated: (card: CardData) => void;
}

export default function WordInputForm({ onCardGenerated }: WordInputFormProps) {
  const { t } = useTranslation();
  const [word, setWord] = useState("");
  const [cardMode, setCardMode] = useState<"jp-jp" | "jp-native">("jp-native");
  const [nativeLanguage, setNativeLanguage] = useState("ko");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!word.trim()) return;

    setError("");
    setLoading(true);

    try {
      const result = await apiClient.post<{ card: CardData }>("/cards/generate", {
        word: word.trim(),
        cardMode,
        nativeLanguage,
      });
      onCardGenerated(result.card);
      setWord("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleGenerate} className="space-y-4">
      <Input
        label={t("generateWord")}
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder={t("wordPlaceholder")}
        autoComplete="off"
        disabled={loading}
      />

      <div className="flex flex-wrap gap-3">
        <select
          value={cardMode}
          onChange={(e) => setCardMode(e.target.value as "jp-jp" | "jp-native")}
          className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
        >
          <option value="jp-jp">{t("cardModeJpJp")}</option>
          <option value="jp-native">{t("cardModeJpNative")}</option>
        </select>

        {cardMode === "jp-native" && (
          <select
            value={nativeLanguage}
            onChange={(e) => setNativeLanguage(e.target.value)}
            className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        )}
      </div>

      <Button type="submit" loading={loading} disabled={!word.trim()}>
        {loading ? t("generating") : t("generateWord")}
      </Button>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </form>
  );
}
