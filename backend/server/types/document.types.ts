import { User } from "../models/user";


interface SummariseDocumentRequest {
  user: User;
  file: File;
}

interface SummariseDocumentResponse {
  message: string;
  id: string;
  summary: string;
  title: string;
  tags: string[];
}

export type {
  SummariseDocumentResponse,
  SummariseDocumentRequest
};
