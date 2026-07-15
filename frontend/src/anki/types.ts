/**
 * 카드 모드: jp-jp(일본어 정의) 또는 jp-native(모국어 뜻)
 */
export type CardMode = "jp-jp" | "jp-native";

/**
 * AI가 생성하고 검증한 카드 데이터 구조.
 * DynamoDB 저장, 프런트엔드 미리보기, AnkiConnect 전송에 공통으로 사용한다.
 */
export interface CardData {
  word: string;
  reading: string;
  furiganaWord: string;
  cardMode: CardMode;
  definition: string;
  nativeMeaning?: string;
  expressions: string[];
  expressionReadings?: string[];
  examples: string[];
  exampleReadings: string[];
  synonyms: string[];
  kanji: Record<string, string>;
}

/**
 * Anki 카드 상태
 */
export type CardStatus = "GENERATING" | "READY" | "FAILED" | "ADDED";

/**
 * DynamoDB에 저장되는 카드 엔터티 (서버 응답용)
 */
export interface CardEntity {
  cardId: string;
  userId: string;
  word: string;
  reading: string;
  cardMode: CardMode;
  nativeLanguage: string;
  status: CardStatus;
  favorite: boolean;
  cardData: CardData;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  addedAt?: string;
}
