package com.signife.ankihelper.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * DynamoDB에 저장되는 카드 엔터티.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record CardEntity(
        String userId,
        String cardId,
        String word,
        String reading,
        String cardMode,
        String nativeLanguage,
        String status,
        boolean favorite,
        CardData cardData,
        int schemaVersion,
        String createdAt,
        String updatedAt,
        String addedAt
) {
    public static final String STATUS_GENERATING = "GENERATING";
    public static final String STATUS_READY = "READY";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_ADDED = "ADDED";
}
