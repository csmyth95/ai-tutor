const AWS = require("aws-sdk");

// TODO Use Workload Identity instead of generating an access key?
class AWSService {
  constructor() {
    this.s3 = new AWS.S3({
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
      return await this.s3.upload(params).promise();
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  }

  async objectExists(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };
      await this.s3.headObject(params).promise();
      return true; // Object exists
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
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };
      await this.s3.deleteObject(params).promise();
      console.log(`Deleted ${key} from bucket ${bucketName}`);
    } catch (error) {
      console.error("Error deleting from S3:", error);
      throw error;
    }
  }
}

module.exports = AWSService;
