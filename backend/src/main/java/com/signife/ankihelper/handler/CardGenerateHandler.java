package com.signife.ankihelper.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.signife.ankihelper.model.ApiResponse;
import com.signife.ankihelper.model.CardEntity;
import com.signife.ankihelper.model.GenerateCardRequest;
import com.signife.ankihelper.service.CardService;
import com.signife.ankihelper.service.UsageService;

/**
 * POST /cards/generate
 * 일본어 단어를 입력받아 Bedrock으로 카드 데이터를 생성한다.
 */
public class CardGenerateHandler extends BaseHandler {

    private final CardService cardService = new CardService();
    private final UsageService usageService = new UsageService();

    @Override
    protected ApiResponse handle(
            APIGatewayProxyRequestEvent request, String userId, Context context) throws Exception {

        GenerateCardRequest body = parseBody(request, GenerateCardRequest.class);

        if (body.word() == null || body.word().isBlank()) {
            return ApiResponse.badRequest("word is required.");
        }
        if (body.cardMode() == null || body.cardMode().isBlank()) {
            return ApiResponse.badRequest("cardMode is required.");
        }

        // 사용량 한도 확인
        try {
            usageService.checkCardLimit(userId);
        } catch (IllegalStateException e) {
            return ApiResponse.tooManyRequests(e.getMessage());
        }

        // Bedrock 카드 생성
        CardEntity card = cardService.generateCard(
                userId,
                body.word().trim(),
                body.cardMode(),
                body.nativeLanguage() != null ? body.nativeLanguage() : "ko"
        );

        // 사용량 증가
        usageService.incrementCardUsage(userId);

        // 응답
        String responseJson = MAPPER.writeValueAsString(new java.util.LinkedHashMap<>() {{
            put("card", card);
        }});

        return ApiResponse.created(responseJson);
    }
}
