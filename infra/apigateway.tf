# ─── API Gateway HTTP API ─────────────────────────────────────────────────────

resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://${aws_cloudfront_distribution.frontend.domain_name}"]
    allow_methods = ["GET", "POST", "PATCH", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

# ─── JWT Authorizer (Cognito) ─────────────────────────────────────────────────

resource "aws_apigatewayv2_authorizer" "cognito" {
  api_id           = aws_apigatewayv2_api.main.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-jwt"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.main.id]
    issuer   = "https://cognito-idp.${var.aws_region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
  }
}

# ─── Stage ────────────────────────────────────────────────────────────────────

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId      = "$context.requestId"
      ip             = "$context.identity.sourceIp"
      method         = "$context.httpMethod"
      path           = "$context.path"
      status         = "$context.status"
      latency        = "$context.responseLatency"
      integrationErr = "$context.integrationErrorMessage"
    })
  }
}

# ─── Lambda Integrations ──────────────────────────────────────────────────────

resource "aws_apigatewayv2_integration" "card_generate" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.card_generate.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "audio_generate" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.audio_generate.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "card_crud" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.card_crud.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "usage" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.usage.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "settings" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.settings.invoke_arn
  payload_format_version = "2.0"
}

# ─── Routes ───────────────────────────────────────────────────────────────────

resource "aws_apigatewayv2_route" "card_generate" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "POST /cards/generate"
  target             = "integrations/${aws_apigatewayv2_integration.card_generate.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "audio_generate" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "POST /cards/{cardId}/audio"
  target             = "integrations/${aws_apigatewayv2_integration.audio_generate.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "cards_list" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "GET /cards"
  target             = "integrations/${aws_apigatewayv2_integration.card_crud.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "card_get" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "GET /cards/{cardId}"
  target             = "integrations/${aws_apigatewayv2_integration.card_crud.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "card_update" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "PATCH /cards/{cardId}"
  target             = "integrations/${aws_apigatewayv2_integration.card_crud.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "card_delete" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "DELETE /cards/{cardId}"
  target             = "integrations/${aws_apigatewayv2_integration.card_crud.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "usage" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "GET /usage"
  target             = "integrations/${aws_apigatewayv2_integration.usage.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "settings_get" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "GET /settings"
  target             = "integrations/${aws_apigatewayv2_integration.settings.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

resource "aws_apigatewayv2_route" "settings_update" {
  api_id             = aws_apigatewayv2_api.main.id
  route_key          = "PATCH /settings"
  target             = "integrations/${aws_apigatewayv2_integration.settings.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito.id
}

# ─── Lambda Permissions (API Gateway → Lambda 호출 허용) ──────────────────────

resource "aws_lambda_permission" "card_generate" {
  function_name = aws_lambda_function.card_generate.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "audio_generate" {
  function_name = aws_lambda_function.audio_generate.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "card_crud" {
  function_name = aws_lambda_function.card_crud.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "usage" {
  function_name = aws_lambda_function.usage.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "settings" {
  function_name = aws_lambda_function.settings.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
