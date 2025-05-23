const AWS = require("aws-sdk");

class AWSService {
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadToS3(bucketName, key, body) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: body,
      };
      return await this.s3.upload(params).promise();
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  }

  async objectExists(bucketName, key) {
    try {
      const params = {
        Bucket: bucketName,
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

  async deleteFromS3(bucketName, key) {
    try {
      const params = {
        Bucket: bucketName,
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
