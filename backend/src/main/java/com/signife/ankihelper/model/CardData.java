package com.signife.ankihelper.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import java.util.Map;

/**
 * AI가 생성하고 검증한 카드 데이터 구조.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CardData(
        String word,
        String reading,
        String furiganaWord,
        String cardMode,
        String definition,
        String nativeMeaning,
        List<String> expressions,
        List<String> expressionReadings,
        List<String> examples,
        List<String> exampleReadings,
        List<String> synonyms,
        Map<String, String> kanji
) {
    public CardData {
        if (expressions == null) expressions = List.of();
        if (expressionReadings == null) expressionReadings = List.of();
        if (examples == null) examples = List.of();
        if (exampleReadings == null) exampleReadings = List.of();
        if (synonyms == null) synonyms = List.of();
        if (kanji == null) kanji = Map.of();
    }
}
