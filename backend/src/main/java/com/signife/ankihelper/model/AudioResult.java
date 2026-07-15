package com.signife.ankihelper.model;

import java.util.List;

/**
 * 음성 생성 결과.
 */
public record AudioResult(
        String wordAudio,
        List<String> examplesAudio,
        List<String> expressionsAudio
) {}
