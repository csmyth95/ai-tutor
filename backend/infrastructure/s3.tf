
resource "aws_s3_bucket" "user_uploaded_documents" {
  bucket = "muinteoir-ai-user-uploaded-documents"

  tags = {
    ENV = var.env
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "user_document_lifecycle_config" {
  bucket = aws_s3_bucket.bucket.user_uploaded_documents

  rule {
    id = "document_expiration"
    expiration {
        days = 30
    }
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "user_document_encryption_config" {
  bucket = aws_s3_bucket.mybucket.user_uploaded_documents

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}
