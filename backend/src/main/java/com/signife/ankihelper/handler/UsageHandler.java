package com.signife.ankihelper.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.signife.ankihelper.config.AppConfig;
import com.signife.ankihelper.model.ApiResponse;
import com.signife.ankihelper.model.UsageRecord;
import com.signife.ankihelper.service.UsageService;

/**
 * GET /usage
 * 사용자의 오늘 사용량과 남은 한도를 반환한다.
 */
public class UsageHandler extends BaseHandler {

    private final UsageService usageService = new UsageService();

    @Override
    protected ApiResponse handle(
            APIGatewayProxyRequestEvent request, String userId, Context context) throws Exception {

        UsageRecord usage = usageService.getUsageToday(userId);
        int cardLimit = AppConfig.getDailyCardLimit();
        int audioLimit = AppConfig.getDailyAudioLimit();

        String json = MAPPER.writeValueAsString(new java.util.LinkedHashMap<>() {{
            put("date", usage.date());
            put("cardGenerations", new java.util.LinkedHashMap<>() {{
                put("used", usage.cardGenerations());
                put("limit", cardLimit);
                put("remaining", Math.max(0, cardLimit - usage.cardGenerations()));
            }});
            put("audioGenerations", new java.util.LinkedHashMap<>() {{
                put("used", usage.audioGenerations());
                put("limit", audioLimit);
                put("remaining", Math.max(0, audioLimit - usage.audioGenerations()));
            }});
        }});

        return ApiResponse.ok(json);
    }
}
