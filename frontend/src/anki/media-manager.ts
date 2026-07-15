/**
 * Anki 미디어 파일 관리 — Base64 변환, 파일명 생성, storeMediaFile 래퍼.
 */

import { storeMediaFile } from "./anki-connect-client";

/**
 * Blob을 Base64 문자열로 변환.
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

/**
 * 충돌 가능성이 낮은 고유 오디오 파일명 생성.
 * 형식: signife_{kind}_{timestamp}_{random}.{ext}
 */
export function createAudioFilename(
  kind: string,
  extension = "mp3",
): string {
  const randomPart =
    globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 12) ||
    Math.random().toString(36).slice(2, 14);

  return `signife_${kind}_${Date.now()}_${randomPart}.${extension}`;
}

/**
 * Base64 데이터를 Anki 미디어에 저장하고 실제 저장된 파일명을 반환.
 */
export async function storeAudioMedia(
  data: string,
  kind: string,
  extension = "mp3",
): Promise<string> {
  const filename = createAudioFilename(kind, extension);
  const storedFilename = await storeMediaFile(filename, data);
  return storedFilename;
}

/**
 * Base64 데이터를 Anki 미디어에 저장하고 [sound:filename] 태그를 반환.
 */
export async function storeAndGetSoundTag(
  data: string,
  kind: string,
  extension = "mp3",
): Promise<string> {
  const filename = await storeAudioMedia(data, kind, extension);
  return `[sound:${filename}]`;
}
