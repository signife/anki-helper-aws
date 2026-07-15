terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # 로컬 state로 시작. 추후 S3 backend로 전환 가능.
  # backend "s3" {
  #   bucket         = "anki-helper-tfstate"
  #   key            = "prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "terraform-lock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "anki-helper"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
