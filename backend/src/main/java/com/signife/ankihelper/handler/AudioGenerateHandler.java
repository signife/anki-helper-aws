package com.signife.ankihelper.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.signife.ankihelper.model.*;
import com.signife.ankihelper.service.AudioService;
import com.signife.ankihelper.service.CardService;
import com.signife.ankihelper.service.UsageService;

/**
 * POST /cards/{cardId}/audio
 * 카드의 단어/표현/예문에 대해 Polly 음성을 생성하여 반환한다.
 */
public class AudioGenerateHandler extends BaseHandler {

    private final CardService cardService = new CardService();
    private final AudioService audioService = new AudioService();
    private final UsageService usageService = new UsageService();

    @Override
    protected ApiResponse handle(
            APIGatewayProxyRequestEvent request, String userId, Context context) throws Exception {

        // cardId 추출
        var pathParams = request.getPathParameters();
        String cardId = pathParams != null ? pathParams.get("cardId") : null;
        if (cardId == null || cardId.isBlank()) {
            return ApiResponse.badRequest("cardId is required.");
        }

        // 카드 조회 + 소유권 확인
        CardEntity card = cardService.getCard(userId, cardId);
        if (card == null) {
            return ApiResponse.notFound("Card not found.");
        }

        // 요청 본문 파싱
        AudioGenerateRequest body = parseBody(request, AudioGenerateRequest.class);

        // 음성 한도 확인
        try {
            usageService.checkAudioLimit(userId);
        } catch (IllegalStateException e) {
            return ApiResponse.tooManyRequests(e.getMessage());
        }

        // Polly 음성 생성
        AudioResult result = audioService.generateAudio(
                card.cardData(),
                body.voiceId(),
                body.engine(),
                body.speedRate(),
                true,  // generateWord
                true   // generateExamples
        );

        // 사용량 증가 (생성된 항목 수)
        int audioCount = 1 + result.examplesAudio().size() + result.expressionsAudio().size();
        usageService.incrementAudioUsage(userId, audioCount);

        // 응답
        String responseJson = MAPPER.writeValueAsString(result);
        return ApiResponse.ok(responseJson);
    }
}
