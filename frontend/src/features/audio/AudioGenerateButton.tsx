import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui";
import { apiClient } from "../../lib/api/api-client";

interface AudioGenerateButtonProps {
  cardId: string;
  onGenerated?: () => void;
}

/**
 * 카드의 음성(단어+표현+예문)을 한 번에 생성 요청하는 버튼.
 */
export default function AudioGenerateButton({ cardId, onGenerated }: AudioGenerateButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setLoading(true);

    try {
      await apiClient.post(`/cards/${cardId}/audio`);
      onGenerated?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Audio generation failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="secondary" onClick={handleGenerate} loading={loading}>
        🔊 {loading ? t("generatingAudio") : t("generateAudio")}
      </Button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
