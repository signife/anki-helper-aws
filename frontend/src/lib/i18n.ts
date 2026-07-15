import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en/common.json";
import ko from "../locales/ko/common.json";
import ja from "../locales/ja/common.json";
import zh from "../locales/zh/common.json";

const savedLang = localStorage.getItem("anki-helper-language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
    ja: { translation: ja },
    zh: { translation: zh },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
