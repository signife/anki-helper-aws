# ─── CloudWatch Log Groups ────────────────────────────────────────────────────

resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/apigateway/${var.project_name}-${var.environment}"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

resource "aws_cloudwatch_log_group" "lambda_card_generate" {
  name              = "/aws/lambda/${aws_lambda_function.card_generate.function_name}"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

resource "aws_cloudwatch_log_group" "lambda_audio_generate" {
  name              = "/aws/lambda/${aws_lambda_function.audio_generate.function_name}"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

resource "aws_cloudwatch_log_group" "lambda_card_crud" {
  name              = "/aws/lambda/${aws_lambda_function.card_crud.function_name}"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

resource "aws_cloudwatch_log_group" "lambda_usage" {
  name              = "/aws/lambda/${aws_lambda_function.usage.function_name}"
  retention_in_days = var.environment == "prod" ? 30 : 7
}

resource "aws_cloudwatch_log_group" "lambda_settings" {
  name              = "/aws/lambda/${aws_lambda_function.settings.function_name}"
  retention_in_days = var.environment == "prod" ? 30 : 7
}
