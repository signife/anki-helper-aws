/**
 * CardData → Anki note fields 변환.
 * HTML 이스케이프, ruby 정제, 리스트 변환, kanji JSON 직렬화.
 */

import type { CardData } from "./types";

/**
 * HTML 특수문자 이스케이프.
 */
export function escapeHtml(value: string | undefined | null): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * 허용된 ruby 태그만 남기고 위험한 HTML 제거.
 */
export function sanitizeRubyHtml(value: string | undefined | null): string {
  const template = document.createElement("template");
  template.innerHTML = String(value ?? "");

  const allowedTags = new Set(["RUBY", "RB", "RT", "RP", "BR"]);
  const walker = document.createTreeWalker(
    template.content,
    NodeFilter.SHOW_ELEMENT,
  );

  const toRemove: Element[] = [];

  while (walker.nextNode()) {
    const element = walker.currentNode as Element;
    if (!allowedTags.has(element.tagName)) {
      toRemove.push(element);
      continue;
    }
    // 모든 속성 제거
    for (const attr of Array.from(element.attributes)) {
      element.removeAttribute(attr.name);
    }
  }

  for (const element of toRemove) {
    element.replaceWith(document.createTextNode(element.textContent || ""));
  }

  return template.innerHTML;
}

/**
 * Ruby HTML에서 rt/rp 태그를 제거하여 음성 합성용 텍스트 추출.
 */
export function rubyHtmlToSpeechText(value: string): string {
  const template = document.createElement("template");
  template.innerHTML = sanitizeRubyHtml(value);
  template.content.querySelectorAll("rt, rp").forEach((el) => el.remove());
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
}

/**
 * 문자열 배열 → <ul><li>...</li></ul> HTML (이스케이프됨).
 */
export function listToHtml(items: string[] | undefined): string {
  if (!items || items.length === 0) return "";
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

/**
 * Ruby HTML 배열 → <ul><li>...</li></ul> (ruby 태그 유지, 위험 태그 제거).
 */
export function rubyListToHtml(items: string[] | undefined): string {
  if (!items || items.length === 0) return "";
  return `<ul>${items.map((item) => `<li class="ruby-list-item">${sanitizeRubyHtml(item)}</li>`).join("")}</ul>`;
}

/**
 * kanji 데이터 → JSON 문자열.
 */
export function kanjiToJson(kanji: Record<string, string> | undefined): string {
  if (!kanji || typeof kanji !== "object") return "{}";
  return JSON.stringify(kanji);
}

/**
 * CardData를 Anki 노트 필드 객체로 변환.
 * 음성 필드는 별도로 설정해야 한다.
 */
export function buildNoteFields(card: CardData): Record<string, string> {
  return {
    Word: escapeHtml(card.word),
    Reading: escapeHtml(card.reading),
    FuriganaWord: escapeHtml(card.furiganaWord),
    CardMode: escapeHtml(card.cardMode),
    Definition: escapeHtml(card.definition),
    NativeMeaning: escapeHtml(card.nativeMeaning),
    Expressions: rubyListToHtml(card.expressions),
    ExpressionReadings: listToHtml(card.expressionReadings),
    Examples: rubyListToHtml(card.examples),
    ExampleReadings: listToHtml(card.exampleReadings),
    Synonyms: listToHtml(card.synonyms),
    KanjiData: kanjiToJson(card.kanji),
    // 음성 필드는 비워둔다 — 별도 설정
    WordAudio: "",
    ExamplesAudio: "",
    ExpressionsAudio: "",
    WordAudioSource: "",
    ExamplesAudioSource: "",
    ExpressionsAudioSource: "",
  };
}
