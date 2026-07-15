/**
 * AnkiConnect HTTP 클라이언트.
 * 브라우저에서 localhost:8765의 AnkiConnect에 직접 요청한다.
 */

import { useAnkiStore } from "../stores/anki-store";

export interface AnkiConnectResponse<T = unknown> {
  result: T;
  error: string | null;
}

export interface NoteParams {
  deckName: string;
  modelName: string;
  fields: Record<string, string>;
  options?: {
    allowDuplicate?: boolean;
    duplicateScope?: string;
  };
  tags?: string[];
}

export interface CreateModelParams {
  modelName: string;
  inOrderFields: string[];
  css: string;
  isCloze: boolean;
  cardTemplates: { Name: string; Front: string; Back: string }[];
}

/**
 * AnkiConnect에 요청을 보내는 핵심 함수.
 * HTTP 200이더라도 error 필드가 있으면 throw한다.
 */
export async function invoke<T = unknown>(
  action: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const url = useAnkiStore.getState().ankiUrl || "http://localhost:8765";

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version: 6, params }),
  });

  if (!response.ok) {
    throw new Error(`AnkiConnect HTTP error: ${response.status}`);
  }

  const payload: AnkiConnectResponse<T> = await response.json();

  if (payload.error) {
    throw new Error(payload.error);
  }

  return payload.result;
}

// ─── Typed convenience wrappers ───────────────────────────────────────────────

export function getVersion(): Promise<number> {
  return invoke<number>("version");
}

export function getDeckNames(): Promise<string[]> {
  return invoke<string[]>("deckNames");
}

export function createDeck(deck: string): Promise<number> {
  return invoke<number>("createDeck", { deck });
}

export function getModelNames(): Promise<string[]> {
  return invoke<string[]>("modelNames");
}

export function getModelFieldNames(modelName: string): Promise<string[]> {
  return invoke<string[]>("modelFieldNames", { modelName });
}

export function addModelField(
  modelName: string,
  fieldName: string,
): Promise<null> {
  return invoke<null>("modelFieldAdd", { modelName, fieldName });
}

export function createModel(params: CreateModelParams): Promise<unknown> {
  return invoke("createModel", params as unknown as Record<string, unknown>);
}

export function updateModelTemplates(
  name: string,
  templates: Record<string, { Front: string; Back: string }>,
): Promise<null> {
  return invoke<null>("updateModelTemplates", {
    model: { name, templates },
  });
}

export function updateModelStyling(name: string, css: string): Promise<null> {
  return invoke<null>("updateModelStyling", {
    model: { name, css },
  });
}

export function storeMediaFile(
  filename: string,
  data: string,
): Promise<string> {
  return invoke<string>("storeMediaFile", { filename, data });
}

export function addNote(note: NoteParams): Promise<number> {
  return invoke<number>("addNote", { note });
}
