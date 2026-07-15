package com.signife.ankihelper.service;

import com.signife.ankihelper.client.DynamoDbClientWrapper;
import com.signife.ankihelper.config.AppConfig;
import com.signife.ankihelper.model.UsageRecord;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;

/**
 * 사용자별 일일 사용량 확인, 증가, 한도 초과 검사.
 */
public class UsageService {

    private final DynamoDbClientWrapper db = new DynamoDbClientWrapper();

    /**
     * 오늘의 사용량을 조회한다.
     */
    public UsageRecord getUsageToday(String userId) {
        String today = todayString();
        var item = db.getItem("USER#" + userId, "USAGE#" + today);

        if (item == null) {
            return UsageRecord.empty(userId, today);
        }

        return new UsageRecord(
                userId,
                today,
                Integer.parseInt(item.getOrDefault("cardGenerations", AttributeValue.fromN("0")).n()),
                Integer.parseInt(item.getOrDefault("audioGenerations", AttributeValue.fromN("0")).n())
        );
    }

    /**
     * 카드 생성 한도를 확인한다.
     * @throws IllegalStateException 한도 초과 시
     */
    public void checkCardLimit(String userId) {
        UsageRecord usage = getUsageToday(userId);
        int limit = AppConfig.getDailyCardLimit();

        if (usage.cardGenerations() >= limit) {
            throw new IllegalStateException("Daily card generation limit reached (" + limit + ").");
        }
    }

    /**
     * 음성 생성 한도를 확인한다.
     * @throws IllegalStateException 한도 초과 시
     */
    public void checkAudioLimit(String userId) {
        UsageRecord usage = getUsageToday(userId);
        int limit = AppConfig.getDailyAudioLimit();

        if (usage.audioGenerations() >= limit) {
            throw new IllegalStateException("Daily audio generation limit reached (" + limit + ").");
        }
    }

    /**
     * 카드 생성 사용량을 1 증가시킨다.
     * 레코드가 없으면 자동 생성된다 (ADD 연산).
     */
    public void incrementCardUsage(String userId) {
        ensureUsageItem(userId);
        db.atomicIncrement("USER#" + userId, "USAGE#" + todayString(), "cardGenerations", 1);
    }

    /**
     * 음성 생성 사용량을 증가시킨다.
     */
    public void incrementAudioUsage(String userId, int count) {
        ensureUsageItem(userId);
        db.atomicIncrement("USER#" + userId, "USAGE#" + todayString(), "audioGenerations", count);
    }

    /**
     * 사용량 아이템이 없으면 초기값으로 생성한다.
     */
    private void ensureUsageItem(String userId) {
        String today = todayString();
        var existing = db.getItem("USER#" + userId, "USAGE#" + today);

        if (existing == null) {
            Map<String, AttributeValue> item = new HashMap<>();
            item.put("PK", AttributeValue.fromS("USER#" + userId));
            item.put("SK", AttributeValue.fromS("USAGE#" + today));
            item.put("cardGenerations", AttributeValue.fromN("0"));
            item.put("audioGenerations", AttributeValue.fromN("0"));
            item.put("date", AttributeValue.fromS(today));

            try {
                db.putItemCondition(item, "attribute_not_exists(PK)");
            } catch (Exception e) {
                // 이미 존재하면 무시 (경쟁 상태 대비)
            }
        }
    }

    private String todayString() {
        return LocalDate.now(ZoneOffset.UTC).toString();
    }
}
