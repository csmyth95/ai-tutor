const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const crypto = require("crypto");
const { Sequelize, DataTypes } = require("sequelize");
const { Pipeline } = require("@huggingface/transformers"); // Example summarization pipeline
const jwt = require("jsonwebtoken");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Sequelize Configuration
const sequelize = new Sequelize(process.env.DATABASE_URL);
const Document = sequelize.define("Document", {
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  s3Path: { type: DataTypes.STRING, allowNull: false },
  summary: { type: DataTypes.TEXT },
});

// TODO Refactor into the routes folder
// Summarization Route
const summarise_pdf = async (req, res) => {
// app.post("/api/summarize", authenticate, upload.single("pdf"), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file || !userId) {
      return res.status(400).json({ error: "Invalid request. Missing file or user." });
    }

    const pdfName = file.originalname;
    const uniqueId = crypto.createHash("sha256").update(userId + pdfName).digest("hex");

    // Store PDF in S3 - TODO Refactor into its own method. S3 class?
    const s3Key = `users/${userId}/${uniqueId}.pdf`;
    await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,  // TODO Create Bucket in AWS
        Key: s3Key,
        Body: file.buffer,
      })
      .promise();

    // Summarize PDF content
    const summarizer = Pipeline("summarization", "facebook/bart-large-cnn");
    const summary = await summarizer(file.buffer.toString("utf-8"));

    // Store Metadata in Postgres
    await Document.create({
      id: uniqueId,
      userId,
      s3Path: s3Key,
      summary,
    });

    res.json({ id: uniqueId, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
