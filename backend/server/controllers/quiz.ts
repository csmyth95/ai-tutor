import { Request, Response, NextFunction } from 'express';

import LocalLLM from "../services/LocalLLM.js";
import db from "../models/index.js";
import { GenerateQuizResponse, QuizResponse } from "../types/quiz.types.js";

// Timeout utility for LLM calls
const withTimeout = <T>(promise: Promise<T>, ms: number, operation: string): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${operation} timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
};

const LLM_TIMEOUT = parseInt(process.env.LLM_TIMEOUT || '60000');
let localLLM: LocalLLM;
try {
  let model = process.env.LLM_MODEL || 'gemma3:1b';
  localLLM = new LocalLLM(model = model);
} catch (Error) {
  console.error("Failed to initialize LocalLLM: " + Error);
}

const generate_quiz = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if LLM service is available
    if (!localLLM) {
      return res.status(503).json({ error: 'LLM service unavailable. Please try again later.' });
    }

    const documentId = parseInt(req.params.documentId, 10);
    if (isNaN(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }

    // Fetch the document and verify ownership
    const document = await db.documents.findOne({
      where: { id: documentId, ownerId: user.id }
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    // Check if quiz already exists for this document
    const existingQuiz = await db.quizzes.findOne({
      where: { documentId: documentId }
    });
    if (existingQuiz) {
      const response: GenerateQuizResponse = {
        message: 'Quiz already exists for this document',
        quiz: {
          id: existingQuiz.id,
          documentId: existingQuiz.documentId,
          documentTitle: document.title,
          questions: existingQuiz.questions,
          createdAt: existingQuiz.createdAt.toISOString(),
        }
      };
      return res.json(response);
    }

    // Generate quiz using LLM with timeout
    const questions = await withTimeout(
      localLLM.generate_quiz(document.title, document.summary),
      LLM_TIMEOUT,
      'Quiz generation'
    );

    // Save quiz to database
    const quiz = await db.quizzes.create({
      documentId: documentId,
      questions: questions,
    });

    const response: GenerateQuizResponse = {
      message: 'Quiz generated successfully',
      quiz: {
        id: quiz.id,
        documentId: quiz.documentId,
        documentTitle: document.title,
        questions: quiz.questions,
        createdAt: quiz.createdAt.toISOString(),
      }
    };

    res.json(response);
  } catch (error) {
    console.error("GenerateQuizError:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('timed out')) {
      return res.status(504).json({ error: 'Quiz generation timed out. Please try again.' });
    }
    if (errorMessage.includes('LocalLLM')) {
      return res.status(502).json({ error: 'Failed to generate quiz with AI service.' });
    }
    return res.status(500).json({ error: 'An unexpected error occurred while generating the quiz.' });
  }
};

const get_quiz = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const documentId = parseInt(req.params.documentId, 10);
    if (isNaN(documentId)) {
      return res.status(400).json({ error: 'Invalid document ID' });
    }

    // Fetch the document and verify ownership
    const document = await db.documents.findOne({
      where: { id: documentId, ownerId: user.id }
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found or access denied' });
    }

    // Fetch the quiz
    const quiz = await db.quizzes.findOne({
      where: { documentId: documentId }
    });
    if (!quiz) {
      return res.status(404).json({ error: 'No quiz found for this document' });
    }

    const response: QuizResponse = {
      id: quiz.id,
      documentId: quiz.documentId,
      documentTitle: document.title,
      questions: quiz.questions,
      createdAt: quiz.createdAt.toISOString(),
    };
    res.json(response);
  } catch (error) {
    console.error("GetQuizError: " + error);
    next(error);
  }
};

export default {
  generate_quiz,
  get_quiz,
};
