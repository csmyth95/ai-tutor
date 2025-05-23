# Infrastructure
AWS terraform code to setup the backend of this project.
1. AWS Project: 
2. S3 bucket for storing user documents.

## Prompt
Setup a skeleton terraform infrastructure for AWS. 
Create an S3 bucket to store the PDF files. The bucket should be created in the `eu-north-1` region and should have the following properties:
- The bucket name should be `muinteoir-ai-user-uploaded-pdfs`.
- The bucket should have versioning enabled.
- The bucket should have server-side encryption enabled using AES-256.
- The bucket should have a lifecycle policy that deletes objects older than 365 days.
