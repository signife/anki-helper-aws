// Config & types
export { MODEL_NAME, ANKI_FIELDS, CARD_FONT_STACKS } from "./config";
export type { AnkiFieldName, CardFontKey } from "./config";
export type { CardData, CardMode, CardStatus, CardEntity } from "./types";

// Templates
export { buildCardTemplates, buildCardCss } from "./templates";
export type { CardTemplate } from "./templates";

// AnkiConnect client
export {
  invoke,
  getVersion,
  getDeckNames,
  createDeck,
  getModelNames,
  addNote,
  storeMediaFile,
} from "./anki-connect-client";

// Note type management
export { ensureNoteType } from "./note-type-manager";

// Media
export {
  blobToBase64,
  createAudioFilename,
  storeAudioMedia,
  storeAndGetSoundTag,
} from "./media-manager";

// Card builder
export {
  escapeHtml,
  sanitizeRubyHtml,
  rubyHtmlToSpeechText,
  listToHtml,
  rubyListToHtml,
  kanjiToJson,
  buildNoteFields,
} from "./card-builder";

// Add service
export { addOneCard, addMultipleCards } from "./anki-add-service";
export type { AudioFields, AddCardOptions, AddCardResult, BatchProgress } from "./anki-add-service";

// Connection test
export { testConnection } from "./connection-test";
export type { ConnectionTestResult } from "./connection-test";
