import { createHash } from "crypto";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

import AWSService from "../services/AWSService.js";
import LocalLLM from "../services/LocalLLM.js";
import Document from "../models/document.js";

const awsService = new AWSService();
const localLLM = new LocalLLM();


const summarise_document = async (req, res) => {
  try {
    const userId = req.user.id;
    const document = req.file;
    if (!document || !userId) {
      return res.status(400).json({ error: "Invalid request. Missing file or user." });
    }
    if (document.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: "Invalid file type. Please use 'application/pdf'." });
    }
    const pdfName = document.originalname;
    const uniqueId = createHash("sha256").update(userId + pdfName).digest("hex");
    console.log('Document file: ', document);

    const documentPath = path.resolve(document.path);
    console.log('Creating file stream from document path: ', documentPath);
    let documentText = fs.readFileSync(documentPath, 'utf8');
    console.log('Document text read from file: ', documentText);
    if (!documentText) {
      return res.status(400).json({ error: "No text found in document. Please upload a valid PDF file." });
    }
    documentText = documentText.replace(/\s+/g, ' ');
    
    const title = await localLLM.generate_title(documentText);
    const summary = await localLLM.summarise(documentText);
    // Return empty list for now until tags generation is fixed.
    const tags = []
    console.log('Document title: ', title);
    console.log('Document tags: ', tags);
    console.log('Document summary: ', summary);
    res.json({ id: uniqueId, summary: summary, title: title, tags: tags });
  } catch (error) {
    console.error("SummariseDocumentError: " + error);
    res.status(500).json({ error: "Error: " + error });
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
