package com.signife.ankihelper.service;

import com.signife.ankihelper.client.PollyClientWrapper;
import com.signife.ankihelper.model.AudioResult;
import com.signife.ankihelper.model.CardData;

import java.util.ArrayList;
import java.util.List;

/**
 * Polly 음성 생성 오케스트레이션.
 * 단어, 표현, 예문 각각의 읽기 텍스트로 순차 호출한다.
 */
public class AudioService {

    private final PollyClientWrapper polly = new PollyClientWrapper();

    /**
     * 카드의 모든 음성을 생성한다.
     * 부분 실패 시 성공한 항목은 유지한다.
     */
    public AudioResult generateAudio(
            CardData card,
            String voiceId,
            String engine,
            double speedRate,
            boolean generateWord,
            boolean generateExamples
    ) {
        String wordAudio = "";
        List<String> examplesAudio = new ArrayList<>();
        List<String> expressionsAudio = new ArrayList<>();

        // 단어 음성
        if (generateWord && card.reading() != null && !card.reading().isBlank()) {
            try {
                wordAudio = polly.synthesize(card.reading(), voiceId, engine, speedRate);
            } catch (Exception e) {
                // 부분 실패 — 로그 남기고 계속
                wordAudio = "";
            }
        }

        // 예문 음성
        if (generateExamples && card.exampleReadings() != null) {
            for (String reading : card.exampleReadings()) {
                if (reading == null || reading.isBlank()) {
                    examplesAudio.add("");
                    continue;
                }
                try {
                    examplesAudio.add(polly.synthesize(reading, voiceId, engine, speedRate));
                } catch (Exception e) {
                    examplesAudio.add("");
                }
            }
        }

        // 표현 음성
        if (generateExamples && card.expressionReadings() != null) {
            for (String reading : card.expressionReadings()) {
                if (reading == null || reading.isBlank()) {
                    expressionsAudio.add("");
                    continue;
                }
                try {
                    expressionsAudio.add(polly.synthesize(reading, voiceId, engine, speedRate));
                } catch (Exception e) {
                    expressionsAudio.add("");
                }
            }
        }

        return new AudioResult(wordAudio, examplesAudio, expressionsAudio);
    }
}
