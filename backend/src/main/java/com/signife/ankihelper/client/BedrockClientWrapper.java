package com.signife.ankihelper.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.signife.ankihelper.config.AppConfig;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.bedrockruntime.BedrockRuntimeClient;
import software.amazon.awssdk.services.bedrockruntime.model.InvokeModelRequest;

/**
 * Amazon Bedrock InvokeModel 호출 래퍼.
 */
public class BedrockClientWrapper {

    private static final BedrockRuntimeClient CLIENT = BedrockRuntimeClient.builder()
            .region(Region.of(AppConfig.getBedrockRegion()))
            .build();

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /**
     * Bedrock 모델에 프롬프트를 전송하고 응답 JSON을 반환한다.
     *
     * @param systemPrompt 시스템 프롬프트
     * @param userMessage 사용자 메시지 (일본어 단어)
     * @return 모델 응답의 텍스트 content
     */
    public String invokeModel(String systemPrompt, String userMessage) throws Exception {
        String modelId = AppConfig.getBedrockModelId();

        // Claude Messages API 형식
        String requestBody = MAPPER.writeValueAsString(new java.util.LinkedHashMap<>() {{
            put("anthropic_version", "bedrock-2023-05-31");
            put("max_tokens", 4096);
            put("system", systemPrompt);
            put("messages", java.util.List.of(
                    java.util.Map.of("role", "user", "content", userMessage)
            ));
        }});

        var response = CLIENT.invokeModel(InvokeModelRequest.builder()
                .modelId(modelId)
                .contentType("application/json")
                .accept("application/json")
                .body(SdkBytes.fromUtf8String(requestBody))
                .build());

        String responseBody = response.body().asUtf8String();
        JsonNode root = MAPPER.readTree(responseBody);

        // Claude 응답에서 텍스트 추출
        JsonNode content = root.path("content");
        if (content.isArray() && !content.isEmpty()) {
            return content.get(0).path("text").asText("");
        }

        return responseBody;
    }
}
