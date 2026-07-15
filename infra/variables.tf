variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name prefix for resources"
  type        = string
  default     = "anki-helper"
}

variable "bedrock_model_id" {
  description = "Bedrock model ID"
  type        = string
  default     = "us.amazon.nova-lite-v1:0"
}

variable "daily_card_limit" {
  description = "Daily card generation limit per user"
  type        = number
  default     = 30
}

variable "daily_audio_limit" {
  description = "Daily audio generation limit per user"
  type        = number
  default     = 50
}
