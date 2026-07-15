package com.signife.ankihelper.model;

/**
 * POST /cards/{cardId}/audio 요청 본문.
 */
public record AudioGenerateRequest(
        String voiceId,
        String engine,
        double speedRate
) {
    public AudioGenerateRequest {
        if (voiceId == null || voiceId.isBlank()) voiceId = "Kazuha";
        if (engine == null || engine.isBlank()) engine = "neural";
        if (speedRate <= 0) speedRate = 1.0;
    }
}
