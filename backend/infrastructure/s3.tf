
resource "aws_s3_bucket" "user_uploaded_documents" {
  bucket = "muinteoir-ai-user-uploaded-documents"
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  lifecycle_rule {
    enabled = true
    expiration {
      days = 30
    }
  }
  tags = {
    ENV = var.env
  }
}
