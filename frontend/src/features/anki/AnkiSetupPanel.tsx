import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Progress } from "../../components/ui";
import { ensureNoteType } from "../../anki/note-type-manager";
import { createDeck, getDeckNames } from "../../anki/anki-connect-client";
import type { CardFontKey } from "../../anki/config";

export default function AnkiSetupPanel() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [fontKey] = useState<CardFontKey>("ms-mincho");
  const [deckName] = useState(() => localStorage.getItem("anki-helper-deck") || "Japanese");

  async function handleSetup() {
    setLoading(true);
    setError("");
    setMessage("");
    setProgress(10);

    try {
      // 1. Deck
      setMessage("Checking deck…");
      setProgress(20);
      const decks = await getDeckNames();
      if (!decks.includes(deckName)) {
        await createDeck(deckName);
        setMessage(`Deck created: ${deckName}`);
      } else {
        setMessage(`Deck exists: ${deckName}`);
      }
      setProgress(40);

      // 2. Note type
      setMessage("Setting up note type…");
      setProgress(60);
      const result = await ensureNoteType(fontKey);

      if (result.modelCreated) {
        setMessage(`Note type created: signife_anki_helper`);
      } else {
        const msg = result.fieldsAdded.length > 0
          ? `Updated. Fields added: ${result.fieldsAdded.join(", ")}`
          : "Note type up to date.";
        setMessage(msg);
      }

      setProgress(100);
      setMessage(t("setupReady"));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`${t("setupFailed")}: ${msg}`);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 space-y-4">
      <h3 className="font-semibold">{t("ankiSetup")}</h3>
      <p className="text-sm text-gray-400">
        Create the deck and note type with 18 fields, card templates, and CSS.
      </p>

      <Button onClick={handleSetup} loading={loading}>
        ⚙ {t("createSetup")}
      </Button>

      {loading && <Progress value={progress} label={message} />}

      {!loading && message && !error && (
        <p className="text-sm text-emerald-400">{message}</p>
      )}

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
