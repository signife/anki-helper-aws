export const MODEL_NAME = "signife_anki_helper";

export const ANKI_FIELDS = [
  "Word",
  "Reading",
  "FuriganaWord",
  "CardMode",
  "Definition",
  "NativeMeaning",
  "Expressions",
  "ExpressionReadings",
  "Examples",
  "ExampleReadings",
  "Synonyms",
  "KanjiData",
  "WordAudio",
  "ExamplesAudio",
  "ExpressionsAudio",
  "WordAudioSource",
  "ExamplesAudioSource",
  "ExpressionsAudioSource",
] as const;

export type AnkiFieldName = (typeof ANKI_FIELDS)[number];

export const CARD_FONT_STACKS: Record<string, string> = {
  "ms-mincho": '"MS Mincho", "ＭＳ 明朝", serif',
  "yu-mincho":
    '"Yu Mincho", "MS Mincho", "Hiragino Mincho ProN", "Noto Serif CJK JP", serif',
  meiryo:
    '"Meiryo", "Yu Gothic", "Hiragino Sans", "Noto Sans CJK JP", sans-serif',
  "yu-gothic":
    '"Yu Gothic", "Meiryo", "Hiragino Sans", "Noto Sans CJK JP", sans-serif',
  "malgun-gothic":
    '"Malgun Gothic", "Apple SD Gothic Neo", "Noto Sans CJK KR", sans-serif',
  batang: '"Batang", "AppleMyungjo", "Noto Serif CJK KR", serif',
  "microsoft-yahei":
    '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif',
  simsun: '"SimSun", "Songti SC", "Noto Serif CJK SC", serif',
  "segoe-ui": '"Segoe UI", Arial, Helvetica, sans-serif',
  arial: "Arial, Helvetica, sans-serif",
  "times-new-roman": '"Times New Roman", Times, serif',
};

export type CardFontKey = keyof typeof CARD_FONT_STACKS;
