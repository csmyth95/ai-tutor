
resource "aws_s3_bucket" "user_uploaded_documents" {
  bucket = "muinteoir-ai-user-uploaded-documents"

  tags = {
    env = var.env
    project = var.project
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "user_document_lifecycle_config" {
  bucket = aws_s3_bucket.user_uploaded_documents.id
  rule {
    id = "document_expiration"
    status = "Enabled"

    filter {
        prefix = "documents/"
    }

    expiration {
        days = 30
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "user_document_encryption_config" {
  bucket = aws_s3_bucket.user_uploaded_documents.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "AES256"
    }
  }
}
