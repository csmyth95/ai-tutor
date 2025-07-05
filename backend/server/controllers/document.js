import { createHash } from "crypto";
import { Pipeline } from "@huggingface/transformers";
import AWSService from "../services/AWSService.js";
import Document from "../models/document.js";

const awsService = new AWSService();


const summarise_document = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file || !userId) {
      return res.status(400).json({ error: "Invalid request. Missing file or user." });
    }

    const pdfName = file.originalname;
    const uniqueId = createHash("sha256").update(userId + pdfName).digest("hex");
    const s3Path = `users/${userId}/${uniqueId}.pdf`;

    // TODO Add option for local storgage. Best design pattern for this? Factory pattern?
    // TODO Add AWS features after summarisation is complete. 
    // const fileExists = await awsService.objectExists(s3Key);
    // if (fileExists) {
    //   return res.status(409).json({ error: "File already exists in the S3 bucket." });
    // }
    // await awsService.uploadToS3(key=uniqueId, body=file.buffer.toString("utf-8"));

    // Summarize PDF content
    const summarizer = Pipeline("summarization", "facebook/bart-large-cnn");
    const summary = await summarizer(file.buffer.toString("utf-8"));

    // Generate title and tags using an LLM
    const llm = Pipeline("text-generation", "gpt-4"); // Example LLM pipeline
    const titlePrompt = `Generate a concise and descriptive title for the following text:\n\n${summary}`;
    const tagsPrompt = `Generate a list of relevant tags (comma-separated) for the following text:\n\n${summary}`;

    const titleResponse = await llm(titlePrompt);
    const tagsResponse = await llm(tagsPrompt);

    const title = titleResponse[0].generated_text.trim();
    const tags = tagsResponse[0].generated_text.split(",").map(tag => tag.trim());

    // Store Metadata in Postgres
    // TODO Rename s3Path to storagePath or similar for clarity.
    await Document.create({
      id: uniqueId,
      userId: userId,
      s3Path: s3Path,
      summary: summary,
      title: title,
      tags: tags,
    });

    res.json({ id: uniqueId, summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const delete_document = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ error: "Document ID is required." });
    }

    // Ensure the logged-in user owns the document
    if (document.userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this document." });
    }

    // Fetch & delete the document from Postgres
    const document = await Document.findOne({ where: { id: documentId } });
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }
    await Document.destroy({ where: { id: documentId } });

    // Check if the document exists & delete the file from S3
    const s3Key = document.s3Path;
    const fileExists = await awsService.objectExists(s3Key);
    if (!fileExists) {
      return res.status(404).json({ error: "File not found in S3." });
    }
    await awsService.deleteFromS3(s3Key);

    res.json({ message: "Document deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the document." });
  }
};

const get_user_documents = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "Invalid request. User ID is required." });
    }

    // Fetch all documents for the user from Postgres
    const documents = await Document.findAll({ where: { userId } });
    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "No documents found for this user." });
    }

    res.json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching documents." });
  }
};

const get_document = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId } = req.params;

    const document = await Document.findOne({ where: { id: documentId, userId } });
    if (!document) {
      return res.status(404).json({ error: "Document not found." });
    }

    res.json({ document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching the document." });
  }
};

const search_documents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    const documents = await Document.findAll({
      where: {
        userId,
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { tags: { [Op.iLike]: `%${query}%` } },
          { summary: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "No documents found matching the query." });
    }

    res.json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while searching for documents." });
  }
};

export default {
  summarise_document,
  delete_document,
  get_user_documents,
  get_document,
  search_documents,
};
