package com.signife.ankihelper.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.Map;

/**
 * API Gateway에 반환하는 표준 응답 모델.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse(
        int statusCode,
        Map<String, String> headers,
        String body
) {
    private static final Map<String, String> DEFAULT_HEADERS = Map.of(
            "Content-Type", "application/json",
            "Access-Control-Allow-Origin", "*"
    );

    public static ApiResponse ok(String body) {
        return new ApiResponse(200, DEFAULT_HEADERS, body);
    }

    public static ApiResponse created(String body) {
        return new ApiResponse(201, DEFAULT_HEADERS, body);
    }

    public static ApiResponse badRequest(String message) {
        return error(400, "BAD_REQUEST", message);
    }

    public static ApiResponse unauthorized(String message) {
        return error(401, "UNAUTHORIZED", message);
    }

    public static ApiResponse forbidden(String message) {
        return error(403, "FORBIDDEN", message);
    }

    public static ApiResponse notFound(String message) {
        return error(404, "NOT_FOUND", message);
    }

    public static ApiResponse conflict(String message) {
        return error(409, "CONFLICT", message);
    }

    public static ApiResponse tooManyRequests(String message) {
        return error(429, "TOO_MANY_REQUESTS", message);
    }

    public static ApiResponse internalError(String message) {
        return error(500, "INTERNAL_ERROR", message);
    }

    private static ApiResponse error(int status, String code, String message) {
        String body = """
                {"code":"%s","message":"%s"}""".formatted(code, escapeJson(message));
        return new ApiResponse(status, DEFAULT_HEADERS, body);
    }

    private static String escapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r");
    }
}
