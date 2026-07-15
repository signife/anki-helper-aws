package com.signife.ankihelper.model;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 사용자별 설정 (DynamoDB 저장).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserSettings(
        String userId,
        String cardMode,
        String nativeLanguage,
        String deckName,
        String cardFont,
        String pollyVoiceId,
        String pollyEngine,
        double speechSpeed,
        boolean generateWordAudio,
        boolean generateExampleAudio
) {
    public static UserSettings defaults(String userId) {
        return new UserSettings(
                userId, "jp-native", "ko", "Japanese", "ms-mincho",
                "Kazuha", "neural", 1.0, true, true
        );
    }
}
