import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui";
import { AnkiSettingsPanel, ConnectionTestPanel, AnkiSetupPanel } from "../features/anki";
import { apiClient } from "../lib/api/api-client";

interface UserSettings {
  cardMode: "jp-jp" | "jp-native";
  nativeLanguage: string;
  pollyVoiceId: string;
  speechSpeed: number;
  generateWordAudio: boolean;
  generateExampleAudio: boolean;
  cardFont: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  cardMode: "jp-native",
  nativeLanguage: "ko",
  pollyVoiceId: "Kazuha",
  speechSpeed: 1.0,
  generateWordAudio: true,
  generateExampleAudio: true,
  cardFont: "ms-mincho",
};

export default function SettingsPage() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get<{ settings: UserSettings }>("/settings");
        setSettings(res.settings);
      } catch { /* use defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await apiClient.patch("/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { /* TODO */ }
    finally { setSaving(false); }
  }

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="space-y-8 max-w-[600px]">
      <h1 className="text-[28px] font-semibold">{t("settings")}</h1>

      {/* Card Generation */}
      <SettingsCard title={t("cardGeneration")}>
        <Row label={t("cardMode")}>
          <Select value={settings.cardMode} onChange={(v) => update("cardMode", v as "jp-jp" | "jp-native")}>
            <option value="jp-jp">{t("cardModeJpJp")}</option>
            <option value="jp-native">{t("cardModeJpNative")}</option>
          </Select>
        </Row>
        <Row label={t("nativeLanguage")}>
          <Select value={settings.nativeLanguage} onChange={(v) => update("nativeLanguage", v)}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </Select>
        </Row>
        <Row label={t("cardFont")}>
          <Select value={settings.cardFont} onChange={(v) => update("cardFont", v)}>
            <option value="ms-mincho">MS Mincho</option>
            <option value="yu-mincho">Yu Mincho</option>
            <option value="meiryo">Meiryo</option>
            <option value="malgun-gothic">Malgun Gothic</option>
            <option value="segoe-ui">Segoe UI</option>
          </Select>
        </Row>
      </SettingsCard>

      {/* Audio */}
      <SettingsCard title={t("audio")}>
        <Row label={t("pollyVoice")}>
          <Select value={settings.pollyVoiceId} onChange={(v) => update("pollyVoiceId", v)}>
            <option value="Kazuha">Kazuha (Neural)</option>
            <option value="Tomoko">Tomoko (Neural)</option>
            <option value="Takumi">Takumi (Standard)</option>
            <option value="Mizuki">Mizuki (Standard)</option>
          </Select>
        </Row>
        <Row label={t("speechSpeed")}>
          <input
            type="number"
            value={settings.speechSpeed}
            onChange={(e) => update("speechSpeed", parseFloat(e.target.value) || 1)}
            step={0.05}
            min={0.5}
            max={2.0}
            className="h-[34px] w-20 px-3 rounded-sm border border-hairline dark:border-hairline-dark bg-canvas dark:bg-dark-surface text-[14px] text-ink dark:text-on-dark outline-none focus:border-accent"
          />
        </Row>
        <Row label={t("generateWordAudio")}>
          <Toggle checked={settings.generateWordAudio} onChange={(v) => update("generateWordAudio", v)} />
        </Row>
        <Row label={t("generateExampleAudio")}>
          <Toggle checked={settings.generateExampleAudio} onChange={(v) => update("generateExampleAudio", v)} />
        </Row>
      </SettingsCard>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving} size="sm">
          {t("saveSettings")}
        </Button>
        {saved && <span className="text-[13px] text-success">{t("settingsSaved")}</span>}
      </div>

      {/* Anki panels */}
      <AnkiSettingsPanel />
      <ConnectionTestPanel />
      <AnkiSetupPanel />
    </section>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-lg border border-hairline dark:border-hairline-dark bg-canvas dark:bg-dark-surface space-y-4">
      <h3 className="text-[14px] font-semibold text-ink dark:text-on-dark">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[14px] text-ink-muted dark:text-on-dark-muted">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Select({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-[34px] px-3 rounded-sm border border-hairline dark:border-hairline-dark bg-canvas dark:bg-dark-surface text-[14px] text-ink dark:text-on-dark outline-none cursor-pointer focus:border-accent"
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-[42px] h-[26px] rounded-pill transition-colors ${
        checked ? "bg-success" : "bg-hairline dark:bg-hairline-dark"
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4" : ""
        }`}
      />
    </button>
  );
}
