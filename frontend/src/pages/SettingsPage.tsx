import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui";
import { AnkiSettingsPanel, ConnectionTestPanel, AnkiSetupPanel } from "../features/anki";
import { apiClient } from "../lib/api/api-client";
import i18n from "../lib/i18n";

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
  const [language, setLanguage] = useState(i18n.language);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // 설정 로드
  useEffect(() => {
    async function load() {
      try {
        const res = await apiClient.get<{ settings: UserSettings }>("/settings");
        setSettings(res.settings);
      } catch {
        // API 미연결 시 로컬 기본값 사용
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 설정 저장
  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      await apiClient.patch("/settings", settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // TODO: 에러 표시
    } finally {
      setSaving(false);
    }
  }

  // 언어 변경
  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("anki-helper-language", lang);
  }

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="space-y-8 max-w-2xl">
      <h1 className="text-2xl font-bold">{t("settings")}</h1>

      {/* Language */}
      <fieldset className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
        <legend className="text-sm font-semibold text-gray-300 px-2">Language</legend>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
          <option value="ja">日本語</option>
          <option value="zh">中文</option>
        </select>
      </fieldset>

      {/* Card Generation */}
      <fieldset className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
        <legend className="text-sm font-semibold text-gray-300 px-2">
          {t("cardGeneration")}
        </legend>

        <Row label={t("cardMode")}>
          <select
            value={settings.cardMode}
            onChange={(e) => update("cardMode", e.target.value as "jp-jp" | "jp-native")}
            className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
          >
            <option value="jp-jp">{t("cardModeJpJp")}</option>
            <option value="jp-native">{t("cardModeJpNative")}</option>
          </select>
        </Row>

        <Row label={t("nativeLanguage")}>
          <select
            value={settings.nativeLanguage}
            onChange={(e) => update("nativeLanguage", e.target.value)}
            className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
          >
            <option value="ko">한국어</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
          </select>
        </Row>

        <Row label={t("cardFont")}>
          <select
            value={settings.cardFont}
            onChange={(e) => update("cardFont", e.target.value)}
            className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
          >
            <option value="ms-mincho">MS Mincho</option>
            <option value="yu-mincho">Yu Mincho</option>
            <option value="meiryo">Meiryo</option>
            <option value="malgun-gothic">Malgun Gothic</option>
            <option value="segoe-ui">Segoe UI</option>
          </select>
        </Row>
      </fieldset>

      {/* Audio */}
      <fieldset className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
        <legend className="text-sm font-semibold text-gray-300 px-2">
          {t("audio")}
        </legend>

        <Row label={t("pollyVoice")}>
          <select
            value={settings.pollyVoiceId}
            onChange={(e) => update("pollyVoiceId", e.target.value)}
            className="h-10 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
          >
            <option value="Kazuha">Kazuha (Neural)</option>
            <option value="Tomoko">Tomoko (Neural)</option>
            <option value="Takumi">Takumi (Standard)</option>
            <option value="Mizuki">Mizuki (Standard)</option>
          </select>
        </Row>

        <Row label={t("speechSpeed")}>
          <input
            type="number"
            value={settings.speechSpeed}
            onChange={(e) => update("speechSpeed", parseFloat(e.target.value) || 1)}
            step={0.05}
            min={0.5}
            max={2.0}
            className="h-10 w-24 px-3 rounded-lg bg-gray-900 border border-white/10 text-white text-sm"
          />
        </Row>

        <Row label={t("generateWordAudio")}>
          <input
            type="checkbox"
            checked={settings.generateWordAudio}
            onChange={(e) => update("generateWordAudio", e.target.checked)}
            className="w-5 h-5 accent-indigo-500"
          />
        </Row>

        <Row label={t("generateExampleAudio")}>
          <input
            type="checkbox"
            checked={settings.generateExampleAudio}
            onChange={(e) => update("generateExampleAudio", e.target.checked)}
            className="w-5 h-5 accent-indigo-500"
          />
        </Row>
      </fieldset>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving}>
          💾 {t("saveSettings")}
        </Button>
        {saved && <span className="text-sm text-emerald-400">{t("settingsSaved")}</span>}
      </div>

      {/* Anki Panels */}
      <AnkiSettingsPanel />
      <ConnectionTestPanel />
      <AnkiSetupPanel />
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <span className="text-sm text-gray-400 sm:w-44 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
