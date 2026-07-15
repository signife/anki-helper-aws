package com.signife.ankihelper.model;

/**
 * POST /cards/generate 요청 본문.
 */
public record GenerateCardRequest(
        String word,
        String cardMode,
        String nativeLanguage
) {}
