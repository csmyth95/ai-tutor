import { createHash } from "crypto";
import { Op } from "sequelize";
import { Request, Response, NextFunction } from 'express';
import fs from "fs";
import path from "path";

import LocalLLM from "../services/LocalLLM";
import Document from "../models/document";
import { SummariseDocumentResponse } from "../types/document.types";
import { ErrorResponse } from "../types/generic.types";

const localLLM = new LocalLLM();


const summarise_document = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF file.' });
    }
    const file = req.file;
    const user = req.user; // This comes from the auth middleware
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if the uploaded file is a PDF
    if (file.mimetype !== 'application/pdf') {
      // Clean up the uploaded file if it's not a PDF
      fs.unlinkSync(file.path);
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF files are allowed.' 
      });
    }

    // Generate a unique ID for the document
    const pdfName = file.originalname;
    const uniqueId = createHash('sha256')
      .update(user.id + pdfName + Date.now())
      .digest('hex');

    console.log('Processing PDF file:', {
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path
    });

    // Read the uploaded file
    const documentPath = path.resolve(file.path);
    console.log('Reading PDF from path:', documentPath);
    
    // Note: For actual PDF text extraction, you'll need a PDF parsing library
    // like pdf-parse, pdf.js, or pdf2json. The current implementation assumes
    // the file is already in text format, which isn't the case for PDFs.
    let documentText = fs.readFileSync(documentPath, 'utf8');
    
    // If we successfully read the file, clean it up
    fs.unlinkSync(documentPath);
    if (!documentText) {
      const errorResponse: ErrorResponse = {  
        error: 'Could not extract text from the PDF. The file might be corrupted or empty.'
      }
      return res.status(400).json(errorResponse);
    }
    
    // Clean up whitespace
    documentText = documentText.replace(/\s+/g, ' ').trim();
    if (!documentText) {
      return res.status(400).json({ error: "No text found in document. Please upload a valid PDF file." });
    }
    documentText = documentText.replace(/\s+/g, ' ');
    
    const title = await localLLM.generate_title(documentText);
    const summary = await localLLM.summarise(documentText);
    // Return empty list for now until tags generation is fixed.
    const tags: string[] = []
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
    console.error("SummariseDocumentError: " + error);
    // res.status(500).json({ error: "Error: " + error });
    next(error);
  }
};

const get_user_documents = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({ error: "Invalid request. User ID is required." });
    }

    // Fetch all documents for the user from Postgres
    const documents = await Document.findAll({ where: { userId: user.id } });
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
