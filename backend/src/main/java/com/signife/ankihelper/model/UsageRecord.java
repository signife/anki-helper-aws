package com.signife.ankihelper.model;

/**
 * 사용자별 일일 사용량 레코드.
 */
public record UsageRecord(
        String userId,
        String date,
        int cardGenerations,
        int audioGenerations
) {
    public static UsageRecord empty(String userId, String date) {
        return new UsageRecord(userId, date, 0, 0);
    }
}
