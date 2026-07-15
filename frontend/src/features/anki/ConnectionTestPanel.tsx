import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Badge, Spinner } from "../../components/ui";
import { useAnkiStore } from "../../stores/anki-store";
import { testConnection } from "../../anki/connection-test";
import type { ConnectionTestResult } from "../../anki/connection-test";

export default function ConnectionTestPanel() {
  const { t } = useTranslation();
  const { connectionStatus, ankiUrl } = useAnkiStore();
  const [result, setResult] = useState<ConnectionTestResult | null>(null);
  const [deckName] = useState(() => localStorage.getItem("anki-helper-deck") || "Japanese");

  async function handleTest() {
    setResult(null);
    const res = await testConnection(deckName);
    setResult(res);
  }

  return (
    <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t("testConnection")}</h3>
        <Badge
          variant={
            connectionStatus === "connected"
              ? "success"
              : connectionStatus === "error"
                ? "error"
                : "default"
          }
        >
          {connectionStatus === "loading" && <Spinner size="sm" />}
          {connectionStatus === "connected" && "✓ " + t("connectionSuccess")}
          {connectionStatus === "error" && "✕ " + t("connectionFailed")}
          {connectionStatus === "idle" && "●"}
        </Badge>
      </div>

      <p className="text-sm text-gray-400">{ankiUrl}</p>

      <Button variant="secondary" onClick={handleTest} loading={connectionStatus === "loading"}>
        {t("testConnection")}
      </Button>

      {result && !result.connected && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm space-y-1">
          <p>{result.error}</p>
          <p>{t("connectionHelp")}</p>
        </div>
      )}

      {result && result.connected && (
        <div className="space-y-1 text-sm">
          <p className="text-emerald-400">AnkiConnect v{result.version}</p>
          <p className={result.deckFound ? "text-gray-300" : "text-amber-400"}>
            {result.deckFound ? `✓ ${t("deckFound")}: ${deckName}` : `⚠ ${t("deckMissing")}`}
          </p>
          <p className={result.modelFound ? "text-gray-300" : "text-amber-400"}>
            {result.modelFound ? `✓ ${t("modelFound")}` : `⚠ ${t("modelMissing")}`}
          </p>
        </div>
      )}
    </div>
  );
}
