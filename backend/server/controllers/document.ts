import { createHash } from "crypto";
import { Request, Response, NextFunction } from 'express';
import fs from "fs";
import path from "path";

import LocalLLM from "../services/LocalLLM.js";
import db from "../models/index.js";
import { SummariseDocumentResponse } from "../types/document.types.js";
import { ErrorResponse } from "../types/generic.types.js";

// Timeout utility for LLM calls
const withTimeout = <T>(promise: Promise<T>, ms: number, operation: string): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const LLM_TIMEOUT = parseInt(process.env.LLM_TIMEOUT || '60000');
let localLLM: LocalLLM;
try{
  let model = process.env.LLM_MODEL || 'gemma3:1b';
  localLLM = new LocalLLM(model=model);
} catch (Error) {
  console.error("Failed to initialize LocalLLM: " + Error);
}


const summarise_document = async (req: Request, res: Response, _next: NextFunction) => {
  let filePath: string | null = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a text document (.txt or .md).' });
    }
    const file = req.file;
    filePath = file.path;

    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if LLM service is available
    if (!localLLM) {
      return res.status(503).json({ error: 'LLM service unavailable. Please try again later.' });
    }

    // Check if the uploaded file is a text document
    const allowedMimeTypes = ['text/plain', 'text/markdown'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only text documents (.txt, .md) are allowed.'
      });
    }

    // Generate a unique ID for the document
    const fileName = file.originalname;
    const uniqueId = createHash('sha256')
      .update(user.id + fileName + Date.now())
      .digest('hex');

    console.log('Processing document:', {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path
    });

    // Read the uploaded text file
    const documentPath = path.resolve(file.path);
    console.log('Reading document from path:', documentPath);

    let documentText = fs.readFileSync(documentPath, 'utf8');

    if (!documentText) {
      const errorResponse: ErrorResponse = {
        error: 'Could not read the document. The file might be corrupted or empty.'
      }
      return res.status(400).json(errorResponse);
    }

    // Clean up whitespace
    documentText = documentText.replace(/\s+/g, ' ').trim();
    if (!documentText) {
      return res.status(400).json({ error: "No text found in document. Please upload a valid text file." });
    }

    // Generate title and summary with timeout
    const title = await withTimeout(
      localLLM.generate_title(documentText),
      LLM_TIMEOUT,
      'Title generation'
    );
    const summary = await withTimeout(
      localLLM.summarise(documentText),
      LLM_TIMEOUT,
      'Summary generation'
    );

    const tags: string[] = [];
    console.log('Document title: ', title);
    console.log('Document tags: ', tags);
    console.log('Document summary: ', summary);

    const response: SummariseDocumentResponse = {
      message: 'Document summarised successfully',
      id: uniqueId,
      summary: summary,
      title: title,
      tags: tags
    };
    res.json(response);
  } catch (error) {
    console.error("SummariseDocumentError:", error);

    // Categorize errors and return appropriate status
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('timed out')) {
      return res.status(504).json({ error: 'Document processing timed out. Please try again.' });
    }
    if (errorMessage.includes('LocalLLM')) {
      return res.status(502).json({ error: 'Failed to process document with AI service.' });
    }

    return res.status(500).json({ error: 'An unexpected error occurred while processing the document.' });
  } finally {
    // Always clean up temp file
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error('Failed to cleanup temp file:', cleanupError);
      }
    }
  }
};

const get_user_documents = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: "Invalid request. User ID is required." });
    }

    // Fetch all documents for the user from Postgres
    const documents = await db.documents.findAll({ where: { ownerId: user.id } });
    if (!documents || documents.length === 0) {
      return res.status(404).json({ error: "No documents found for this user." });
    }

    res.json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching documents." });
  }
};

export default {
  summarise_document,
  get_user_documents,
};
