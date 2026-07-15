package com.signife.ankihelper.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.signife.ankihelper.client.BedrockClientWrapper;
import com.signife.ankihelper.client.DynamoDbClientWrapper;
import com.signife.ankihelper.model.CardData;
import com.signife.ankihelper.model.CardEntity;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.time.Instant;
import java.util.*;
import java.util.regex.Pattern;

/**
 * 카드 생성(Bedrock), 검증, 정규화, CRUD.
 */
public class CardService {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final Pattern DANGEROUS_HTML = Pattern.compile(
            "<(?!/?(?:ruby|rb|rt|rp|br)\\b)[^>]+>", Pattern.CASE_INSENSITIVE
    );

    private final BedrockClientWrapper bedrock = new BedrockClientWrapper();
    private final DynamoDbClientWrapper db = new DynamoDbClientWrapper();

    // ─── Generate ───────────────────────────────────────────────────────────────

    public CardEntity generateCard(String userId, String word, String cardMode, String nativeLanguage) throws Exception {
        validateInput(word, cardMode);

        String systemPrompt = buildSystemPrompt(cardMode, nativeLanguage);
        String response = bedrock.invokeModel(systemPrompt, word);

        // JSON 파싱 (Markdown fence 제거)
        String json = stripJsonFence(response);
        CardData rawData = MAPPER.readValue(json, CardData.class);

        // 검증
        validateCardData(rawData, cardMode);

        // HTML 정제
        CardData sanitized = sanitizeCardData(rawData);

        // 엔터티 생성
        String cardId = UUID.randomUUID().toString();
        String now = Instant.now().toString();

        CardEntity entity = new CardEntity(
                userId, cardId, sanitized.word(), sanitized.reading(),
                cardMode, nativeLanguage, CardEntity.STATUS_READY, false,
                sanitized, 1, now, now, null
        );

        // DynamoDB 저장
        saveCard(entity);

        return entity;
    }

    // ─── CRUD ───────────────────────────────────────────────────────────────────

    public CardEntity getCard(String userId, String cardId) {
        var item = db.getItem("USER#" + userId, "CARD#" + cardId);
        if (item == null) return null;
        return itemToEntity(item);
    }

    public List<CardEntity> listCards(String userId, int limit, String cursor) {
        Map<String, AttributeValue> startKey = null;
        if (cursor != null && !cursor.isBlank()) {
            startKey = Map.of(
                    "PK", AttributeValue.fromS("USER#" + userId),
                    "SK", AttributeValue.fromS(cursor)
            );
        }

        var items = db.query("USER#" + userId, "CARD#", limit, startKey, false);
        return items.stream().map(this::itemToEntity).toList();
    }

    public void updateCardStatus(String userId, String cardId, String newStatus) {
        String now = Instant.now().toString();
        Map<String, AttributeValue> values = new HashMap<>();
        values.put(":status", AttributeValue.fromS(newStatus));
        values.put(":now", AttributeValue.fromS(now));
        values.put(":userId", AttributeValue.fromS(userId));

        String update = "SET #status = :status, updatedAt = :now";
        if (CardEntity.STATUS_ADDED.equals(newStatus)) {
            update += ", addedAt = :now";
        }

        db.updateItem(
                "USER#" + userId, "CARD#" + cardId,
                update, values,
                "attribute_exists(PK)"
        );
    }

    public void updateCardData(String userId, String cardId, CardData newData) throws Exception {
        String now = Instant.now().toString();
        CardData sanitized = sanitizeCardData(newData);
        String dataJson = MAPPER.writeValueAsString(sanitized);

        Map<String, AttributeValue> values = new HashMap<>();
        values.put(":data", AttributeValue.fromS(dataJson));
        values.put(":now", AttributeValue.fromS(now));

        db.updateItem(
                "USER#" + userId, "CARD#" + cardId,
                "SET cardData = :data, updatedAt = :now", values,
                "attribute_exists(PK)"
        );
    }

    public void toggleFavorite(String userId, String cardId, boolean favorite) {
        Map<String, AttributeValue> values = new HashMap<>();
        values.put(":fav", AttributeValue.fromBool(favorite));

        db.updateItem(
                "USER#" + userId, "CARD#" + cardId,
                "SET favorite = :fav", values,
                "attribute_exists(PK)"
        );
    }

    public void deleteCard(String userId, String cardId) {
        db.deleteItem("USER#" + userId, "CARD#" + cardId,
                "attribute_exists(PK)", null);
    }

    // ─── Validation ─────────────────────────────────────────────────────────────

    private void validateInput(String word, String cardMode) {
        if (word == null || word.isBlank()) {
            throw new IllegalArgumentException("Word is required.");
        }
        if (word.length() > 100) {
            throw new IllegalArgumentException("Word exceeds maximum length of 100.");
        }
        if (!"jp-jp".equals(cardMode) && !"jp-native".equals(cardMode)) {
            throw new IllegalArgumentException("cardMode must be jp-jp or jp-native.");
        }
    }

    private void validateCardData(CardData data, String cardMode) {
        if (data.word() == null || data.word().isBlank()) {
            throw new IllegalArgumentException("Generated card missing word.");
        }
        if (data.reading() == null || data.reading().isBlank()) {
            throw new IllegalArgumentException("Generated card missing reading.");
        }
        if (data.furiganaWord() == null || data.furiganaWord().isBlank()) {
            throw new IllegalArgumentException("Generated card missing furiganaWord.");
        }
        if (data.definition() == null || data.definition().isBlank()) {
            throw new IllegalArgumentException("Generated card missing definition.");
        }
        if ("jp-native".equals(cardMode) && (data.nativeMeaning() == null || data.nativeMeaning().isBlank())) {
            throw new IllegalArgumentException("Generated card missing nativeMeaning for jp-native mode.");
        }
        if (data.examples().size() != data.exampleReadings().size()) {
            throw new IllegalArgumentException("examples and exampleReadings length mismatch.");
        }
        if (data.expressions().size() != data.expressionReadings().size()) {
            throw new IllegalArgumentException("expressions and expressionReadings length mismatch.");
        }
    }

    // ─── Sanitization ───────────────────────────────────────────────────────────

    private CardData sanitizeCardData(CardData data) {
        return new CardData(
                data.word(),
                data.reading(),
                data.furiganaWord(),
                data.cardMode(),
                sanitizeText(data.definition()),
                data.nativeMeaning() != null ? sanitizeText(data.nativeMeaning()) : null,
                data.expressions().stream().map(this::sanitizeRubyHtml).toList(),
                data.expressionReadings(),
                data.examples().stream().map(this::sanitizeRubyHtml).toList(),
                data.exampleReadings(),
                data.synonyms(),
                data.kanji()
        );
    }

    private String sanitizeRubyHtml(String html) {
        if (html == null) return "";
        // 허용 태그(ruby, rb, rt, rp, br)만 남기고 나머지 제거
        return DANGEROUS_HTML.matcher(html).replaceAll("");
    }

    private String sanitizeText(String text) {
        if (text == null) return "";
        return text.replaceAll("<[^>]+>", "");
    }

    // ─── Prompt ─────────────────────────────────────────────────────────────────

    private String buildSystemPrompt(String cardMode, String nativeLanguage) {
        String langName = switch (nativeLanguage) {
            case "ko" -> "Korean";
            case "en" -> "English";
            case "zh" -> "Chinese";
            default -> "English";
        };

        return """
                You are a Japanese language expert. Generate a vocabulary card for the given Japanese word.
                Return ONLY valid JSON with these fields:
                - word: the Japanese word
                - reading: full hiragana reading
                - furiganaWord: Anki furigana format (漢字[reading])
                - cardMode: "%s"
                - definition: natural Japanese dictionary definition
                %s
                - expressions: 3-5 common collocations with HTML ruby tags
                - expressionReadings: full hiragana for each expression (same order)
                - examples: 2 natural example sentences with HTML ruby tags
                - exampleReadings: full hiragana for each example (same order)
                - synonyms: 2-4 synonyms
                - kanji: object with each kanji's onyomi, kunyomi, meaning
                
                Ruby format: <ruby><rb>漢字</rb><rt>かんじ</rt></ruby>
                Use [] for empty arrays, {} for empty objects. No null values.
                No markdown fences. No explanations. JSON only.
                """.formatted(
                cardMode,
                "jp-native".equals(cardMode)
                        ? "- nativeMeaning: meaning in " + langName
                        : ""
        );
    }

    // ─── Helpers ────────────────────────────────────────────────────────────────

    private String stripJsonFence(String raw) {
        String trimmed = raw.trim();
        if (trimmed.startsWith("```")) {
            int start = trimmed.indexOf('\n');
            int end = trimmed.lastIndexOf("```");
            if (start > 0 && end > start) {
                return trimmed.substring(start + 1, end).trim();
            }
        }
        return trimmed;
    }

    private void saveCard(CardEntity entity) {
        try {
            String dataJson = MAPPER.writeValueAsString(entity.cardData());
            Map<String, AttributeValue> item = new HashMap<>();
            item.put("PK", AttributeValue.fromS("USER#" + entity.userId()));
            item.put("SK", AttributeValue.fromS("CARD#" + entity.cardId()));
            item.put("cardId", AttributeValue.fromS(entity.cardId()));
            item.put("word", AttributeValue.fromS(entity.word()));
            item.put("reading", AttributeValue.fromS(entity.reading()));
            item.put("cardMode", AttributeValue.fromS(entity.cardMode()));
            item.put("nativeLanguage", AttributeValue.fromS(entity.nativeLanguage()));
            item.put("status", AttributeValue.fromS(entity.status()));
            item.put("favorite", AttributeValue.fromBool(entity.favorite()));
            item.put("cardData", AttributeValue.fromS(dataJson));
            item.put("schemaVersion", AttributeValue.fromN("1"));
            item.put("createdAt", AttributeValue.fromS(entity.createdAt()));
            item.put("updatedAt", AttributeValue.fromS(entity.updatedAt()));
            db.putItem(item);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save card", e);
        }
    }

    private CardEntity itemToEntity(Map<String, AttributeValue> item) {
        try {
            String dataJson = item.getOrDefault("cardData", AttributeValue.fromS("{}")).s();
            CardData data = MAPPER.readValue(dataJson, CardData.class);

            return new CardEntity(
                    extractPkUserId(item.get("PK").s()),
                    item.getOrDefault("cardId", AttributeValue.fromS("")).s(),
                    item.getOrDefault("word", AttributeValue.fromS("")).s(),
                    item.getOrDefault("reading", AttributeValue.fromS("")).s(),
                    item.getOrDefault("cardMode", AttributeValue.fromS("jp-jp")).s(),
                    item.getOrDefault("nativeLanguage", AttributeValue.fromS("ko")).s(),
                    item.getOrDefault("status", AttributeValue.fromS("READY")).s(),
                    item.containsKey("favorite") && item.get("favorite").bool(),
                    data,
                    Integer.parseInt(item.getOrDefault("schemaVersion", AttributeValue.fromN("1")).n()),
                    item.getOrDefault("createdAt", AttributeValue.fromS("")).s(),
                    item.getOrDefault("updatedAt", AttributeValue.fromS("")).s(),
                    item.containsKey("addedAt") ? item.get("addedAt").s() : null
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize card", e);
        }
    }

    private String extractPkUserId(String pk) {
        return pk.startsWith("USER#") ? pk.substring(5) : pk;
    }
}
