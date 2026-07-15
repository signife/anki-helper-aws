# ─── Cognito User Pool ────────────────────────────────────────────────────────

resource "aws_cognito_user_pool" "main" {
  name = "${var.project_name}-${var.environment}"

  # 이메일로 로그인
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # 비밀번호 정책
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }

  # 이메일 인증
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "ANKI-HELPER verification code"
    email_message        = "Your verification code is {####}"
  }

  # 계정 복구
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # 스키마 — 최소 속성만
  schema {
    name                = "email"
    attribute_data_type = "String"
    required            = true
    mutable             = true
  }
}

# ─── Cognito App Client (SPA — Client Secret 없음) ───────────────────────────

resource "aws_cognito_user_pool_client" "main" {
  name         = "${var.project_name}-web"
  user_pool_id = aws_cognito_user_pool.main.id

  generate_secret = false # SPA는 Client Secret 사용 안 함

  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
  ]

  supported_identity_providers = ["COGNITO"]

  # 토큰 유효기간
  access_token_validity  = 1  # 시간
  id_token_validity      = 1  # 시간
  refresh_token_validity = 30 # 일

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }
}
