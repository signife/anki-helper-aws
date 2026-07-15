/**
 * Anki 노트 타입 확인, 생성, 필드 추가, 템플릿/CSS 업데이트.
 */

import {
  getModelNames,
  getModelFieldNames,
  addModelField,
  createModel,
  updateModelTemplates,
  updateModelStyling,
} from "./anki-connect-client";
import { MODEL_NAME, ANKI_FIELDS, CARD_FONT_STACKS } from "./config";
import { buildCardTemplates, buildCardCss } from "./templates";
import type { CardFontKey } from "./config";

export interface SetupResult {
  modelCreated: boolean;
  modelUpdated: boolean;
  fieldsAdded: string[];
}

/**
 * 노트 타입이 존재하면 필드/템플릿을 업데이트하고,
 * 없으면 새로 생성한다.
 */
export async function ensureNoteType(
  fontKey: CardFontKey = "ms-mincho",
): Promise<SetupResult> {
  const fontStack = CARD_FONT_STACKS[fontKey] || CARD_FONT_STACKS["ms-mincho"];
  const models = await getModelNames();

  if (models.includes(MODEL_NAME)) {
    const fieldsAdded = await ensureFields();
    await applyTemplatesAndCss(fontStack);
    return { modelCreated: false, modelUpdated: true, fieldsAdded };
  }

  // 노트 타입 생성
  await createModel({
    modelName: MODEL_NAME,
    inOrderFields: [...ANKI_FIELDS],
    css: buildCardCss(fontStack),
    isCloze: false,
    cardTemplates: buildCardTemplates(),
  });

  return { modelCreated: true, modelUpdated: false, fieldsAdded: [] };
}

/**
 * 기존 노트 타입에 누락된 필드를 추가한다.
 * 기존 필드나 데이터는 삭제하지 않는다.
 */
async function ensureFields(): Promise<string[]> {
  const existingFields = await getModelFieldNames(MODEL_NAME);
  const added: string[] = [];

  for (const fieldName of ANKI_FIELDS) {
    if (!existingFields.includes(fieldName)) {
      await addModelField(MODEL_NAME, fieldName);
      added.push(fieldName);
    }
  }

  return added;
}

/**
 * 앞면/뒷면 템플릿과 CSS를 최신 버전으로 업데이트한다.
 */
async function applyTemplatesAndCss(fontStack: string): Promise<void> {
  const templates = buildCardTemplates();

  const templateMap: Record<string, { Front: string; Back: string }> = {};
  for (const t of templates) {
    templateMap[t.Name] = { Front: t.Front, Back: t.Back };
  }

  await updateModelTemplates(MODEL_NAME, templateMap);
  await updateModelStyling(MODEL_NAME, buildCardCss(fontStack));
}
