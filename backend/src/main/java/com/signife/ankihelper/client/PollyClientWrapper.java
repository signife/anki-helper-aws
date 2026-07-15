package com.signife.ankihelper.client;

import software.amazon.awssdk.services.polly.PollyClient;
import software.amazon.awssdk.services.polly.model.*;

import java.util.Base64;
import java.util.Set;

/**
 * Amazon Polly SynthesizeSpeech 호출 래퍼.
 */
public class PollyClientWrapper {

    private static final PollyClient CLIENT = PollyClient.create();

    private static final Set<String> ALLOWED_VOICES = Set.of(
            "Mizuki", "Takumi", "Kazuha", "Tomoko"
    );

    private static final Set<String> ALLOWED_ENGINES = Set.of(
            "standard", "neural", "generative"
    );

    /**
     * 일본어 텍스트를 음성으로 변환하고 Base64 문자열로 반환한다.
     *
     * @param text 합성할 텍스트 (히라가나 우선)
     * @param voiceId Polly Voice ID
     * @param engine 엔진 (standard, neural, generative)
     * @param speedRate 속도 (0.5 ~ 2.0)
     * @return mp3 음성의 Base64 인코딩
     */
    public String synthesize(String text, String voiceId, String engine, double speedRate) {
        validateVoice(voiceId);
        validateEngine(engine);
        validateSpeed(speedRate);
        validateTextLength(text);

        // SSML로 속도 조절
        String ssml = buildSsml(text, speedRate);

        var response = CLIENT.synthesizeSpeech(SynthesizeSpeechRequest.builder()
                .text(ssml)
                .textType(TextType.SSML)
                .voiceId(VoiceId.fromValue(voiceId))
                .engine(Engine.fromValue(engine))
                .outputFormat(OutputFormat.MP3)
                .languageCode(LanguageCode.JA_JP)
                .build());

        try (var stream = response) {
            byte[] bytes = stream.readAllBytes();
            return Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to read Polly audio stream", e);
        }
    }

    private String buildSsml(String text, double speedRate) {
        int percent = (int) (speedRate * 100);
        return "<speak><prosody rate=\"" + percent + "%\">" + escapeXml(text) + "</prosody></speak>";
    }

    private String escapeXml(String text) {
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&apos;");
    }

    private void validateVoice(String voiceId) {
        if (!ALLOWED_VOICES.contains(voiceId)) {
            throw new IllegalArgumentException("Unsupported voice: " + voiceId);
        }
    }

    private void validateEngine(String engine) {
        if (!ALLOWED_ENGINES.contains(engine)) {
            throw new IllegalArgumentException("Unsupported engine: " + engine);
        }
    }

    private void validateSpeed(double rate) {
        if (rate < 0.5 || rate > 2.0) {
            throw new IllegalArgumentException("Speed rate must be between 0.5 and 2.0");
        }
    }

    private void validateTextLength(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Synthesis text cannot be empty");
        }
        if (text.length() > 3000) {
            throw new IllegalArgumentException("Text exceeds maximum length of 3000 characters");
        }
    }
}
