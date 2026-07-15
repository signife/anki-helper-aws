import type { CardData } from "../types";

export const SAMPLE_CARDS: Record<string, CardData> = {
  "jp-jp": {
    cardMode: "jp-jp",
    word: "正義",
    reading: "せいぎ",
    furiganaWord: "正義[せいぎ]",
    definition: "正しい道理。また、社会を公平に保つための正しい考え方。",
    expressions: [
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>く",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>守</rb><rt>まも</rt></ruby>る",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>の<ruby><rb>味方</rb><rt>みかた</rt></ruby>",
    ],
    examples: [
      "<ruby><rb>彼</rb><rt>かれ</rt></ruby>は<ruby><rb>最後</rb><rt>さいご</rt></ruby>まで<ruby><rb>自分</rb><rt>じぶん</rt></ruby>の<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>いた。",
      "それは<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する<ruby><rb>行為</rb><rt>こうい</rt></ruby>だ。",
    ],
    exampleReadings: [
      "かれはさいごまでじぶんのせいぎをつらぬいた。",
      "それはせいぎにはんするこういだ。",
    ],
    synonyms: ["公正", "正当", "道義"],
    kanji: {
      "正": "音読み：セイ・ショウ／訓読み：ただしい・ただす",
      "義": "音読み：ギ／意味：人として守るべき正しい道理",
    },
  },

  "jp-ko": {
    cardMode: "jp-native",
    word: "正義",
    reading: "せいぎ",
    furiganaWord: "正義[せいぎ]",
    definition: "正しい道理。また、社会を公平に保つための正しい考え方。",
    nativeMeaning: "정의, 올바른 도리",
    expressions: [
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>く",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>守</rb><rt>まも</rt></ruby>る",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>の<ruby><rb>味方</rb><rt>みかた</rt></ruby>",
    ],
    examples: [
      "<ruby><rb>彼</rb><rt>かれ</rt></ruby>は<ruby><rb>最後</rb><rt>さいご</rt></ruby>まで<ruby><rb>自分</rb><rt>じぶん</rt></ruby>の<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>いた。",
      "それは<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する<ruby><rb>行為</rb><rt>こうい</rt></ruby>だ。",
    ],
    exampleReadings: [
      "かれはさいごまでじぶんのせいぎをつらぬいた。",
      "それはせいぎにはんするこういだ。",
    ],
    synonyms: ["公正", "正当", "道義"],
    kanji: {
      "正": "음독: セイ・ショウ / 훈독: ただしい・ただす",
      "義": "음독: ギ / 뜻: 사람이 지켜야 할 올바른 도리",
    },
  },

  "jp-en": {
    cardMode: "jp-native",
    word: "正義",
    reading: "せいぎ",
    furiganaWord: "正義[せいぎ]",
    definition: "正しい道理。また、社会を公平に保つための正しい考え方。",
    nativeMeaning: "justice; righteousness; the principle of what is morally right",
    expressions: [
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>く",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>守</rb><rt>まも</rt></ruby>る",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>の<ruby><rb>味方</rb><rt>みかた</rt></ruby>",
    ],
    examples: [
      "<ruby><rb>彼</rb><rt>かれ</rt></ruby>は<ruby><rb>最後</rb><rt>さいご</rt></ruby>まで<ruby><rb>自分</rb><rt>じぶん</rt></ruby>の<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>いた。",
      "それは<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する<ruby><rb>行為</rb><rt>こうい</rt></ruby>だ。",
    ],
    exampleReadings: [
      "かれはさいごまでじぶんのせいぎをつらぬいた。",
      "それはせいぎにはんするこういだ。",
    ],
    synonyms: ["公正", "正当", "道義"],
    kanji: {
      "正": "On: セイ・ショウ / Kun: ただしい・ただす",
      "義": "On: ギ / Meaning: moral duty or what is right",
    },
  },

  "jp-zh": {
    cardMode: "jp-native",
    word: "正義",
    reading: "せいぎ",
    furiganaWord: "正義[せいぎ]",
    definition: "正しい道理。また、社会を公平に保つための正しい考え方。",
    nativeMeaning: "正义；公正的道理；在道德上正确的原则",
    expressions: [
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>く",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>守</rb><rt>まも</rt></ruby>る",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する",
      "<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>の<ruby><rb>味方</rb><rt>みかた</rt></ruby>",
    ],
    examples: [
      "<ruby><rb>彼</rb><rt>かれ</rt></ruby>は<ruby><rb>最後</rb><rt>さいご</rt></ruby>まで<ruby><rb>自分</rb><rt>じぶん</rt></ruby>の<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>を<ruby><rb>貫</rb><rt>つらぬ</rt></ruby>いた。",
      "それは<ruby><rb>正義</rb><rt>せいぎ</rt></ruby>に<ruby><rb>反</rb><rt>はん</rt></ruby>する<ruby><rb>行為</rb><rt>こうい</rt></ruby>だ。",
    ],
    exampleReadings: [
      "かれはさいごまでじぶんのせいぎをつらぬいた。",
      "それはせいぎにはんするこういだ。",
    ],
    synonyms: ["公正", "正当", "道義"],
    kanji: {
      "正": "音读：セイ・ショウ / 训读：ただしい・ただす",
      "義": "音读：ギ / 含义：人应遵守的正确道理",
    },
  },
};
