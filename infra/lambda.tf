# ─── Lambda IAM Role ──────────────────────────────────────────────────────────

resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-lambda-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

# CloudWatch Logs
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# DynamoDB 접근
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "dynamodb-access"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
      ]
      Resource = [
        aws_dynamodb_table.main.arn,
        "${aws_dynamodb_table.main.arn}/index/*"
      ]
    }]
  })
}

# Bedrock 접근
resource "aws_iam_role_policy" "lambda_bedrock" {
  name = "bedrock-access"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["bedrock:InvokeModel"]
      Resource = ["arn:aws:bedrock:${var.aws_region}::foundation-model/*"]
    }]
  })
}

# Polly 접근
resource "aws_iam_role_policy" "lambda_polly" {
  name = "polly-access"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["polly:SynthesizeSpeech"]
      Resource = ["*"]
    }]
  })
}

# ─── Lambda Functions ─────────────────────────────────────────────────────────

# 빌드된 JAR 파일 placeholder (초기 배포용 더미)
data "archive_file" "lambda_dummy" {
  type        = "zip"
  output_path = "${path.module}/.build/dummy.zip"

  source {
    content  = "placeholder"
    filename = "placeholder.txt"
  }
}

locals {
  lambda_env = {
    TABLE_NAME        = aws_dynamodb_table.main.name
    BEDROCK_MODEL_ID  = var.bedrock_model_id
    BEDROCK_REGION    = var.aws_region
    POLLY_VOICE_ID    = "Kazuha"
    POLLY_ENGINE      = "neural"
    DAILY_CARD_LIMIT  = tostring(var.daily_card_limit)
    DAILY_AUDIO_LIMIT = tostring(var.daily_audio_limit)
  }
}

resource "aws_lambda_function" "card_generate" {
  function_name = "${var.project_name}-card-generate-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "com.signife.ankihelper.handler.CardGenerateHandler::handleRequest"
  runtime       = "java21"
  timeout       = 60
  memory_size   = 512

  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = local.lambda_env
  }
}

resource "aws_lambda_function" "audio_generate" {
  function_name = "${var.project_name}-audio-generate-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "com.signife.ankihelper.handler.AudioGenerateHandler::handleRequest"
  runtime       = "java21"
  timeout       = 60
  memory_size   = 512

  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = local.lambda_env
  }
}

resource "aws_lambda_function" "card_crud" {
  function_name = "${var.project_name}-card-crud-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "com.signife.ankihelper.handler.CardCrudHandler::handleRequest"
  runtime       = "java21"
  timeout       = 30
  memory_size   = 256

  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = local.lambda_env
  }
}

resource "aws_lambda_function" "usage" {
  function_name = "${var.project_name}-usage-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "com.signife.ankihelper.handler.UsageHandler::handleRequest"
  runtime       = "java21"
  timeout       = 10
  memory_size   = 256

  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = local.lambda_env
  }
}

resource "aws_lambda_function" "settings" {
  function_name = "${var.project_name}-settings-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "com.signife.ankihelper.handler.SettingsHandler::handleRequest"
  runtime       = "java21"
  timeout       = 10
  memory_size   = 256

  filename         = data.archive_file.lambda_dummy.output_path
  source_code_hash = data.archive_file.lambda_dummy.output_base64sha256

  environment {
    variables = local.lambda_env
  }
}
