# ─── DynamoDB Table (단일 테이블 설계) ────────────────────────────────────────

resource "aws_dynamodb_table" "main" {
  name         = "${var.project_name}-${var.environment}"
  billing_mode = "PAY_PER_REQUEST" # On-Demand

  hash_key  = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  # 서버 사이드 암호화 (AWS 관리형)
  server_side_encryption {
    enabled = true
  }

  # TTL (멱등성 키, 임시 데이터 삭제용)
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = var.environment == "prod"
  }
}
