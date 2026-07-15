package com.signife.ankihelper.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.signife.ankihelper.model.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 모든 Lambda Handler의 기반 클래스.
 * - JSON 직렬화/역직렬화
 * - JWT에서 userId 추출
 * - 공통 에러 처리
 * - API Gateway 응답 변환
 */
public abstract class BaseHandler
        implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected static final ObjectMapper MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    @Override
    public APIGatewayProxyResponseEvent handleRequest(
            APIGatewayProxyRequestEvent request, Context context) {

        try {
            String userId = extractUserId(request);
            if (userId == null || userId.isBlank()) {
                return toGatewayResponse(ApiResponse.unauthorized("Authentication required."));
            }

            ApiResponse response = handle(request, userId, context);
            return toGatewayResponse(response);

        } catch (IllegalArgumentException e) {
            log.warn("Validation error: {}", e.getMessage());
            return toGatewayResponse(ApiResponse.badRequest(e.getMessage()));

        } catch (Exception e) {
            log.error("Unhandled error", e);
            return toGatewayResponse(
                    ApiResponse.internalError("An unexpected error occurred. Please try again."));
        }
    }

    /**
     * 각 Handler가 구현하는 비즈니스 로직.
     */
    protected abstract ApiResponse handle(
            APIGatewayProxyRequestEvent request, String userId, Context context) throws Exception;

    /**
     * API Gateway JWT Authorizer가 검증한 Cognito sub를 추출한다.
     */
    protected String extractUserId(APIGatewayProxyRequestEvent request) {
        var requestContext = request.getRequestContext();
        if (requestContext == null) return null;

        var authorizer = requestContext.getAuthorizer();
        if (authorizer == null) return null;

        // HTTP API (JWT Authorizer) — claims.sub
        var jwt = authorizer.get("jwt");
        if (jwt instanceof java.util.Map<?, ?> jwtMap) {
            var claims = jwtMap.get("claims");
            if (claims instanceof java.util.Map<?, ?> claimsMap) {
                Object sub = claimsMap.get("sub");
                if (sub != null) return sub.toString();
            }
        }

        // REST API (Cognito Authorizer) — claims.sub 직접
        Object sub = authorizer.get("sub");
        if (sub != null) return sub.toString();

        var claims = authorizer.get("claims");
        if (claims instanceof java.util.Map<?, ?> claimsMap) {
            Object claimSub = claimsMap.get("sub");
            if (claimSub != null) return claimSub.toString();
        }

        return null;
    }

    /**
     * ApiResponse를 API Gateway 응답 형식으로 변환.
     */
    private APIGatewayProxyResponseEvent toGatewayResponse(ApiResponse response) {
        var event = new APIGatewayProxyResponseEvent();
        event.setStatusCode(response.statusCode());
        event.setHeaders(response.headers());
        event.setBody(response.body());
        return event;
    }

    /**
     * 요청 본문을 지정한 타입으로 역직렬화.
     */
    protected <T> T parseBody(APIGatewayProxyRequestEvent request, Class<T> type) throws Exception {
        String body = request.getBody();
        if (body == null || body.isBlank()) {
            throw new IllegalArgumentException("Request body is required.");
        }
        return MAPPER.readValue(body, type);
    }
}
