/**
 * AnkiConnect 연결 테스트.
 */

import { getVersion, getDeckNames, getModelNames } from "./anki-connect-client";
import { MODEL_NAME } from "./config";
import { useAnkiStore } from "../stores/anki-store";

export interface ConnectionTestResult {
  connected: boolean;
  version?: number;
  deckFound?: boolean;
  modelFound?: boolean;
  error?: string;
}

/**
 * AnkiConnect 연결 상태를 확인한다.
 * 버전 확인 → 덱 존재 여부 → 노트 타입 존재 여부.
 */
export async function testConnection(
  deckName: string,
): Promise<ConnectionTestResult> {
  const store = useAnkiStore.getState();
  store.setConnectionStatus("loading");

  try {
    const version = await getVersion();

    const [decks, models] = await Promise.all([
      getDeckNames(),
      getModelNames(),
    ]);

    const deckFound = decks.includes(deckName);
    const modelFound = models.includes(MODEL_NAME);

    store.setConnectionStatus("connected");

    return {
      connected: true,
      version,
      deckFound,
      modelFound,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    store.setConnectionStatus("error");

    return {
      connected: false,
      error: message,
    };
  }
}
