 // TODO Verify with real AWS docs & test
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"; 


class AWSService {
  constructor() {
    this.s3 = new S3Client({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || "muinteoir-ai-user-uploaded-documents";
  }

  async uploadToS3(key, body) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: body,
      };
      await this.s3.send(
          new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: body,
          })
      );
      console.log(`Uploaded ${key} to bucket ${this.bucketName}`);
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  }

  async objectExists(key) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      const response = await this.s3.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        return true; // Object exists
      }
      else {
        return false; // Object does not exist
      }
    } catch (error) {
      if (error.code === "NotFound") {
        return false; // Object does not exist
      }
      console.error("Error checking object existence in S3:", error);
      throw error;
    }
  }

  async deleteFromS3(key) {
    try {
      const command = new DeleteObjectCommand({ Bucket: this.bucketName, Key: key });
      await this.s3.send(command);
      console.log(`Deleted ${key} from bucket ${this.bucketName}`);
    } catch (error) {
      console.error("Error deleting from S3:", error);
      throw error;
    }
  }
}

export default AWSService;
