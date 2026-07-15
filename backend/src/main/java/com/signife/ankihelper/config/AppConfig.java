package com.signife.ankihelper.config;

/**
 * Lambda 환경변수에서 설정값을 읽는 유틸리티.
 * 민감정보는 여기에 포함하지 않는다 (Parameter Store 사용).
 */
public final class AppConfig {

    private AppConfig() {}

    public static String getTableName() {
        return env("TABLE_NAME", "anki-helper");
    }

    public static String getBedrockModelId() {
        return env("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0");
    }

    public static String getBedrockRegion() {
        return env("BEDROCK_REGION", "us-east-1");
    }

    public static String getPollyVoiceId() {
        return env("POLLY_VOICE_ID", "Kazuha");
    }

    public static String getPollyEngine() {
        return env("POLLY_ENGINE", "neural");
    }

    public static int getDailyCardLimit() {
        return intEnv("DAILY_CARD_LIMIT", 30);
    }

    public static int getDailyAudioLimit() {
        return intEnv("DAILY_AUDIO_LIMIT", 50);
    }

    private static String env(String key, String defaultValue) {
        String value = System.getenv(key);
        return value != null && !value.isBlank() ? value : defaultValue;
    }

    private static int intEnv(String key, int defaultValue) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) return defaultValue;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
