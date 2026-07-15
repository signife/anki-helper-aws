import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui";

interface AudioPlayerProps {
  /** Base64-encoded audio data */
  audioData?: string;
  /** Audio MIME type */
  mimeType?: string;
  /** Label for the play button */
  label?: string;
  /** Called when user requests audio generation */
  onGenerate?: () => Promise<string>;
}

export default function AudioPlayer({
  audioData,
  mimeType = "audio/mpeg",
  label,
  onGenerate,
}: AudioPlayerProps) {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [localData, setLocalData] = useState(audioData);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handlePlay() {
    let data = localData;

    // Generate on demand if not available
    if (!data && onGenerate) {
      setGenerating(true);
      try {
        data = await onGenerate();
        setLocalData(data);
      } catch {
        return;
      } finally {
        setGenerating(false);
      }
    }

    if (!data) return;

    // Play
    const blob = base64ToBlob(data, mimeType);
    const url = URL.createObjectURL(blob);

    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    setPlaying(true);

    audio.onended = () => {
      setPlaying(false);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setPlaying(false);
      URL.revokeObjectURL(url);
    };

    audio.play();
  }

  function handleStop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    }
  }

  if (!localData && !onGenerate) {
    return (
      <span className="text-xs text-gray-500">{t("audioNotReady")}</span>
    );
  }

  return (
    <Button
      variant="secondary"
      onClick={playing ? handleStop : handlePlay}
      loading={generating}
      className="text-sm"
    >
      {generating
        ? t("generatingAudio")
        : playing
          ? `⏸ ${t("pauseAudio")}`
          : `▶ ${label || t("playAudio")}`}
    </Button>
  );
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}
