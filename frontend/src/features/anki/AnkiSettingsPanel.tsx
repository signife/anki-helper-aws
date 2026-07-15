import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Input } from "../../components/ui";
import { useAnkiStore } from "../../stores/anki-store";

export default function AnkiSettingsPanel() {
  const { t } = useTranslation();
  const { ankiUrl, setAnkiUrl } = useAnkiStore();
  const [localUrl, setLocalUrl] = useState(ankiUrl);
  const [deckName, setDeckName] = useState(
    () => localStorage.getItem("anki-helper-deck") || "Japanese",
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setAnkiUrl(localUrl);
    localStorage.setItem("anki-helper-deck", deckName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
      <h3 className="font-semibold">{t("connectionSettings")}</h3>

      <Input
        label={t("ankiUrl")}
        value={localUrl}
        onChange={(e) => setLocalUrl(e.target.value)}
        placeholder="http://localhost:8765"
      />

      <Input
        label={t("deckName")}
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        placeholder="Japanese"
      />

      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={handleSave}>
          💾 {t("saveSettings")}
        </Button>
        {saved && <span className="text-sm text-emerald-400">{t("settingsSaved")}</span>}
      </div>
    </div>
  );
}
