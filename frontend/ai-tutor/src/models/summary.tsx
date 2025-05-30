export interface Summary {
  id: string; // Unique identifier for the summary
  userId: string; // ID of the user who owns the summary
  s3Path: string; // Path to the PDF file in S3
  summary: string; // Text summary of the PDF
  title: string; // Title of the PDF
  tags?: string[]; // Optional array of tags
  createdAt: string; // Timestamp when the summary was created
  updatedAt: string; // Timestamp when the summary was last updated
}
