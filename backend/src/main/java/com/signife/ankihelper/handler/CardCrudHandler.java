package com.signife.ankihelper.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.signife.ankihelper.model.ApiResponse;
import com.signife.ankihelper.model.CardData;
import com.signife.ankihelper.model.CardEntity;
import com.signife.ankihelper.service.CardService;

import java.util.List;

/**
 * 카드 CRUD 핸들러.
 * - GET    /cards          → 목록 조회
 * - GET    /cards/{cardId} → 상세 조회
 * - PATCH  /cards/{cardId} → 수정
 * - DELETE /cards/{cardId} → 삭제
 */
public class CardCrudHandler extends BaseHandler {

    private final CardService cardService = new CardService();

    @Override
    protected ApiResponse handle(
            APIGatewayProxyRequestEvent request, String userId, Context context) throws Exception {

        String method = request.getHttpMethod();
        String cardId = extractPathParam(request, "cardId");

        return switch (method) {
            case "GET" -> cardId != null ? getCard(userId, cardId) : listCards(userId, request);
            case "PATCH" -> updateCard(userId, cardId, request);
            case "DELETE" -> deleteCard(userId, cardId);
            default -> ApiResponse.badRequest("Unsupported method: " + method);
        };
    }

    private ApiResponse listCards(String userId, APIGatewayProxyRequestEvent request) throws Exception {
        var params = request.getQueryStringParameters();
        int limit = 20;
        String cursor = null;

        if (params != null) {
            if (params.containsKey("limit")) {
                limit = Math.min(100, Math.max(1, Integer.parseInt(params.get("limit"))));
            }
            cursor = params.get("cursor");
        }

        List<CardEntity> cards = cardService.listCards(userId, limit, cursor);

        String json = MAPPER.writeValueAsString(new java.util.LinkedHashMap<>() {{
            put("cards", cards);
            put("count", cards.size());
        }});

        return ApiResponse.ok(json);
    }

    private ApiResponse getCard(String userId, String cardId) throws Exception {
        CardEntity card = cardService.getCard(userId, cardId);
        if (card == null) {
            return ApiResponse.notFound("Card not found.");
        }
        return ApiResponse.ok(MAPPER.writeValueAsString(card));
    }

    private ApiResponse updateCard(String userId, String cardId, APIGatewayProxyRequestEvent request) throws Exception {
        if (cardId == null || cardId.isBlank()) {
            return ApiResponse.badRequest("cardId is required.");
        }

        CardEntity existing = cardService.getCard(userId, cardId);
        if (existing == null) {
            return ApiResponse.notFound("Card not found.");
        }

        JsonNode body = MAPPER.readTree(request.getBody());

        // 상태 변경
        if (body.has("status")) {
            String newStatus = body.get("status").asText();
            cardService.updateCardStatus(userId, cardId, newStatus);
        }

        // 즐겨찾기 토글
        if (body.has("favorite")) {
            boolean fav = body.get("favorite").asBoolean();
            cardService.toggleFavorite(userId, cardId, fav);
        }

        // 카드 데이터 수정
        if (body.has("cardData")) {
            CardData newData = MAPPER.treeToValue(body.get("cardData"), CardData.class);
            cardService.updateCardData(userId, cardId, newData);
        }

        return ApiResponse.ok("{\"message\":\"Card updated.\"}");
    }

    private ApiResponse deleteCard(String userId, String cardId) {
        if (cardId == null || cardId.isBlank()) {
            return ApiResponse.badRequest("cardId is required.");
        }

        cardService.deleteCard(userId, cardId);
        return ApiResponse.ok("{\"message\":\"Card deleted.\"}");
    }

    private String extractPathParam(APIGatewayProxyRequestEvent request, String key) {
        var pathParams = request.getPathParameters();
        return pathParams != null ? pathParams.get(key) : null;
    }
}
