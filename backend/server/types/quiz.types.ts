export interface Question {
  questionText: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
}

export interface QuizResponse {
  id: number;
  documentId: number;
  documentTitle: string;
  questions: Question[];
  createdAt: string;
}

export interface GenerateQuizResponse {
  message: string;
  quiz: QuizResponse;
}
