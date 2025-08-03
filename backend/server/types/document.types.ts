// TODO Need to send the user's ID in the request 
// so needs to be saved in Cookies or localStorage on the login.
interface SummariseDocumentRequest {
  userId: number;
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
