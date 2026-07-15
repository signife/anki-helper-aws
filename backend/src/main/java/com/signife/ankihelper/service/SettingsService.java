package com.signife.ankihelper.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.signife.ankihelper.client.DynamoDbClientWrapper;
import com.signife.ankihelper.model.UserSettings;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.util.HashMap;
import java.util.Map;

/**
 * 사용자 설정 조회/저장 서비스.
 */
public class SettingsService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final DynamoDbClientWrapper db = new DynamoDbClientWrapper();

    public UserSettings getSettings(String userId) {
        var item = db.getItem("USER#" + userId, "SETTINGS");

        if (item == null) {
            return UserSettings.defaults(userId);
        }

        return new UserSettings(
                userId,
                getStr(item, "cardMode", "jp-native"),
                getStr(item, "nativeLanguage", "ko"),
                getStr(item, "deckName", "Japanese"),
                getStr(item, "cardFont", "ms-mincho"),
                getStr(item, "pollyVoiceId", "Kazuha"),
                getStr(item, "pollyEngine", "neural"),
                getDouble(item, "speechSpeed", 1.0),
                getBool(item, "generateWordAudio", true),
                getBool(item, "generateExampleAudio", true)
        );
    }

    public void saveSettings(String userId, UserSettings settings) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("PK", AttributeValue.fromS("USER#" + userId));
        item.put("SK", AttributeValue.fromS("SETTINGS"));
        item.put("cardMode", AttributeValue.fromS(settings.cardMode()));
        item.put("nativeLanguage", AttributeValue.fromS(settings.nativeLanguage()));
        item.put("deckName", AttributeValue.fromS(settings.deckName()));
        item.put("cardFont", AttributeValue.fromS(settings.cardFont()));
        item.put("pollyVoiceId", AttributeValue.fromS(settings.pollyVoiceId()));
        item.put("pollyEngine", AttributeValue.fromS(settings.pollyEngine()));
        item.put("speechSpeed", AttributeValue.fromN(String.valueOf(settings.speechSpeed())));
        item.put("generateWordAudio", AttributeValue.fromBool(settings.generateWordAudio()));
        item.put("generateExampleAudio", AttributeValue.fromBool(settings.generateExampleAudio()));

        db.putItem(item);
    }

    private String getStr(Map<String, AttributeValue> item, String key, String defaultValue) {
        var val = item.get(key);
        return val != null && val.s() != null && !val.s().isBlank() ? val.s() : defaultValue;
    }

    private double getDouble(Map<String, AttributeValue> item, String key, double defaultValue) {
        var val = item.get(key);
        if (val == null || val.n() == null) return defaultValue;
        try {
            return Double.parseDouble(val.n());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private boolean getBool(Map<String, AttributeValue> item, String key, boolean defaultValue) {
        var val = item.get(key);
        return val != null && val.bool() != null ? val.bool() : defaultValue;
    }
}
