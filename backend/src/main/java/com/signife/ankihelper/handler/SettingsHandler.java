package com.signife.ankihelper.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.signife.ankihelper.model.ApiResponse;
import com.signife.ankihelper.model.UserSettings;
import com.signife.ankihelper.service.SettingsService;

/**
 * GET  /settings → 사용자 설정 조회
 * PATCH /settings → 사용자 설정 저장
 */
public class SettingsHandler extends BaseHandler {

    private final SettingsService settingsService = new SettingsService();

    @Override
    protected ApiResponse handle(
            APIGatewayProxyRequestEvent request, String userId, Context context) throws Exception {

        String method = request.getHttpMethod();

        return switch (method) {
            case "GET" -> getSettings(userId);
            case "PATCH" -> saveSettings(userId, request);
            default -> ApiResponse.badRequest("Unsupported method: " + method);
        };
    }

    private ApiResponse getSettings(String userId) throws Exception {
        UserSettings settings = settingsService.getSettings(userId);

        String json = MAPPER.writeValueAsString(new java.util.LinkedHashMap<>() {{
            put("settings", settings);
        }});

        return ApiResponse.ok(json);
    }

    private ApiResponse saveSettings(String userId, APIGatewayProxyRequestEvent request) throws Exception {
        UserSettings body = parseBody(request, UserSettings.class);

        // userId는 JWT에서 가져온 값을 사용 (클라이언트 전송값 무시)
        UserSettings toSave = new UserSettings(
                userId,
                body.cardMode() != null ? body.cardMode() : "jp-native",
                body.nativeLanguage() != null ? body.nativeLanguage() : "ko",
                body.deckName() != null ? body.deckName() : "Japanese",
                body.cardFont() != null ? body.cardFont() : "ms-mincho",
                body.pollyVoiceId() != null ? body.pollyVoiceId() : "Kazuha",
                body.pollyEngine() != null ? body.pollyEngine() : "neural",
                body.speechSpeed() > 0 ? body.speechSpeed() : 1.0,
                body.generateWordAudio(),
                body.generateExampleAudio()
        );

        settingsService.saveSettings(userId, toSave);

        return ApiResponse.ok("{\"message\":\"Settings saved.\"}");
    }
}
