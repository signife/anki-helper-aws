package com.signife.ankihelper.client;

import com.signife.ankihelper.config.AppConfig;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * DynamoDB 테이블 접근 래퍼.
 * Lambda 실행 환경 재사용을 위해 client를 static으로 유지한다.
 */
public class DynamoDbClientWrapper {

    private static final DynamoDbClient CLIENT = DynamoDbClient.create();
    private static final String TABLE = AppConfig.getTableName();

    // ─── Put ────────────────────────────────────────────────────────────────────

    public void putItem(Map<String, AttributeValue> item) {
        CLIENT.putItem(PutItemRequest.builder()
                .tableName(TABLE)
                .item(item)
                .build());
    }

    public void putItemCondition(Map<String, AttributeValue> item, String conditionExpression) {
        CLIENT.putItem(PutItemRequest.builder()
                .tableName(TABLE)
                .item(item)
                .conditionExpression(conditionExpression)
                .build());
    }

    // ─── Get ────────────────────────────────────────────────────────────────────

    public Map<String, AttributeValue> getItem(String pk, String sk) {
        var key = Map.of(
                "PK", AttributeValue.fromS(pk),
                "SK", AttributeValue.fromS(sk)
        );

        var response = CLIENT.getItem(GetItemRequest.builder()
                .tableName(TABLE)
                .key(key)
                .build());

        return response.hasItem() ? response.item() : null;
    }

    // ─── Query ──────────────────────────────────────────────────────────────────

    public List<Map<String, AttributeValue>> query(
            String pkValue,
            String skPrefix,
            int limit,
            Map<String, AttributeValue> exclusiveStartKey,
            boolean scanForward
    ) {
        var expressionValues = new HashMap<String, AttributeValue>();
        expressionValues.put(":pk", AttributeValue.fromS(pkValue));
        expressionValues.put(":skPrefix", AttributeValue.fromS(skPrefix));

        var builder = QueryRequest.builder()
                .tableName(TABLE)
                .keyConditionExpression("PK = :pk AND begins_with(SK, :skPrefix)")
                .expressionAttributeValues(expressionValues)
                .limit(limit)
                .scanIndexForward(scanForward);

        if (exclusiveStartKey != null && !exclusiveStartKey.isEmpty()) {
            builder.exclusiveStartKey(exclusiveStartKey);
        }

        var response = CLIENT.query(builder.build());
        return response.items();
    }

    public Map<String, AttributeValue> queryLastEvaluatedKey(
            String pkValue,
            String skPrefix,
            int limit,
            Map<String, AttributeValue> exclusiveStartKey
    ) {
        var expressionValues = Map.of(
                ":pk", AttributeValue.fromS(pkValue),
                ":skPrefix", AttributeValue.fromS(skPrefix)
        );

        var builder = QueryRequest.builder()
                .tableName(TABLE)
                .keyConditionExpression("PK = :pk AND begins_with(SK, :skPrefix)")
                .expressionAttributeValues(expressionValues)
                .limit(limit)
                .scanIndexForward(false);

        if (exclusiveStartKey != null && !exclusiveStartKey.isEmpty()) {
            builder.exclusiveStartKey(exclusiveStartKey);
        }

        var response = CLIENT.query(builder.build());
        return response.lastEvaluatedKey();
    }

    // ─── Update ─────────────────────────────────────────────────────────────────

    public void updateItem(
            String pk,
            String sk,
            String updateExpression,
            Map<String, AttributeValue> expressionValues,
            String conditionExpression
    ) {
        var key = Map.of(
                "PK", AttributeValue.fromS(pk),
                "SK", AttributeValue.fromS(sk)
        );

        var builder = UpdateItemRequest.builder()
                .tableName(TABLE)
                .key(key)
                .updateExpression(updateExpression)
                .expressionAttributeValues(expressionValues);

        if (conditionExpression != null) {
            builder.conditionExpression(conditionExpression);
        }

        CLIENT.updateItem(builder.build());
    }

    /**
     * 원자적 숫자 증가 (ADD 연산).
     */
    public void atomicIncrement(String pk, String sk, String attribute, int delta) {
        var key = Map.of(
                "PK", AttributeValue.fromS(pk),
                "SK", AttributeValue.fromS(sk)
        );

        CLIENT.updateItem(UpdateItemRequest.builder()
                .tableName(TABLE)
                .key(key)
                .updateExpression("ADD #attr :delta")
                .expressionAttributeNames(Map.of("#attr", attribute))
                .expressionAttributeValues(Map.of(":delta", AttributeValue.fromN(String.valueOf(delta))))
                .build());
    }

    // ─── Delete ─────────────────────────────────────────────────────────────────

    public void deleteItem(String pk, String sk, String conditionExpression,
                           Map<String, AttributeValue> expressionValues) {
        var key = Map.of(
                "PK", AttributeValue.fromS(pk),
                "SK", AttributeValue.fromS(sk)
        );

        var builder = DeleteItemRequest.builder()
                .tableName(TABLE)
                .key(key);

        if (conditionExpression != null) {
            builder.conditionExpression(conditionExpression);
            if (expressionValues != null) {
                builder.expressionAttributeValues(expressionValues);
            }
        }

        CLIENT.deleteItem(builder.build());
    }

    public void deleteItem(String pk, String sk) {
        deleteItem(pk, sk, null, null);
    }
}
