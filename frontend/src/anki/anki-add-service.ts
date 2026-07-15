/**
 * 단일/일괄 카드 Anki 추가 오케스트레이션.
 * 음성 생성(Polly) → 미디어 저장 → 카드 추가 → 상태 반영.
 */

import { addNote } from "./anki-connect-client";
import { buildNoteFields } from "./card-builder";
import { MODEL_NAME } from "./config";
import type { CardData } from "./types";

export interface AudioFields {
  WordAudio: string;
  ExamplesAudio: string;
  ExpressionsAudio: string;
  WordAudioSource: string;
  ExamplesAudioSource: string;
  ExpressionsAudioSource: string;
}

export interface AddCardOptions {
  deckName: string;
  audioFields?: AudioFields;
  allowDuplicate?: boolean;
  tags?: string[];
}

export interface AddCardResult {
  success: boolean;
  word: string;
  noteId?: number;
  error?: string;
}

/**
 * 단일 카드를 Anki에 추가한다.
 */
export async function addOneCard(
  card: CardData,
  options: AddCardOptions,
): Promise<AddCardResult> {
  try {
    const fields = buildNoteFields(card);

    // 음성 필드 병합
    if (options.audioFields) {
      Object.assign(fields, options.audioFields);
    }

    const noteId = await addNote({
      deckName: options.deckName,
      modelName: MODEL_NAME,
      fields,
      options: {
        allowDuplicate: options.allowDuplicate ?? false,
        duplicateScope: "deck",
      },
      tags: options.tags ?? ["Japanese", "AnkiHelper"],
    });

    return { success: true, word: card.word, noteId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, word: card.word, error: message };
  }
}

export interface BatchProgress {
  current: number;
  total: number;
  word: string;
}

/**
 * 여러 카드를 순차적으로 Anki에 추가한다.
 * onProgress 콜백으로 진행 상태를 전달한다.
 */
export async function addMultipleCards(
  cards: CardData[],
  options: Omit<AddCardOptions, "audioFields">,
  getAudioFields?: (card: CardData, index: number) => Promise<AudioFields>,
  onProgress?: (progress: BatchProgress) => void,
): Promise<AddCardResult[]> {
  const results: AddCardResult[] = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    onProgress?.({ current: i + 1, total: cards.length, word: card.word });

    let audioFields: AudioFields | undefined;
    if (getAudioFields) {
      try {
        audioFields = await getAudioFields(card, i);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({
          success: false,
          word: card.word,
          error: `Audio generation failed: ${message}`,
        });
        continue;
      }
    }

    const result = await addOneCard(card, { ...options, audioFields });
    results.push(result);
  }

  return results;
}
