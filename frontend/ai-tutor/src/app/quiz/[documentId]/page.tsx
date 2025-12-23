'use client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Quiz, Question } from '@/models/quiz';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const QuizPage = () => {
  const router = useRouter();
  const params = useParams();
  const documentId = params.documentId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([null, null, null]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Basic ${token}`);
    } else {
      throw new Error('Unauthorized');
    }
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });
    const responseData = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        router.push('/login');
      }
      throw new Error(responseData.error || 'Something went wrong');
    }
    return responseData;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await fetchWithAuth(`${BACKEND_URL}/api/v1/quizzes/documents/${documentId}`);
        setQuiz(data);
        setSelectedAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [documentId]);

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    if (isSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (!quiz) return;

    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsSubmitted(true);
  };

  const allAnswered = selectedAnswers.every(answer => answer !== null);

  if (loading) {
    return (
      <div className="section-container py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-xl text-gray-600">Loading quiz...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-container py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/summary')}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Return to Summaries
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="section-container py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-xl text-gray-600 mb-4">Quiz not found</div>
          <button
            onClick={() => router.push('/summary')}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Return to Summaries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Quiz</h1>
      <h2 className="text-xl text-gray-600 mb-8 text-center">{quiz.documentTitle}</h2>

      {isSubmitted && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-2">
            Your Score: {score} / {quiz.questions.length}
          </h3>
          <p className="text-gray-600">
            {score === quiz.questions.length
              ? 'Perfect! You got all questions correct!'
              : score >= quiz.questions.length / 2
              ? 'Good job! Keep learning!'
              : 'Keep studying and try again!'}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {quiz.questions.map((question: Question, qIndex: number) => (
          <div
            key={qIndex}
            className={`p-6 rounded-lg border ${
              isSubmitted
                ? selectedAnswers[qIndex] === question.correctAnswerIndex
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            <h3 className="text-lg font-semibold mb-4">
              Question {qIndex + 1}: {question.questionText}
            </h3>
            <div className="space-y-3">
              {question.options.map((option: string, oIndex: number) => {
                const isSelected = selectedAnswers[qIndex] === oIndex;
                const isCorrect = question.correctAnswerIndex === oIndex;

                let optionClasses = 'p-3 rounded-lg border cursor-pointer transition-colors ';

                if (isSubmitted) {
                  if (isCorrect) {
                    optionClasses += 'border-green-500 bg-green-100';
                  } else if (isSelected && !isCorrect) {
                    optionClasses += 'border-red-500 bg-red-100';
                  } else {
                    optionClasses += 'border-gray-200 bg-white';
                  }
                } else {
                  optionClasses += isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50';
                }

                return (
                  <div
                    key={oIndex}
                    onClick={() => handleSelectAnswer(qIndex, oIndex)}
                    className={optionClasses}
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={isSelected}
                        onChange={() => handleSelectAnswer(qIndex, oIndex)}
                        disabled={isSubmitted}
                        className="mr-3"
                      />
                      <span>{option}</span>
                      {isSubmitted && isCorrect && (
                        <span className="ml-auto text-green-600 font-semibold">Correct</span>
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <span className="ml-auto text-red-600 font-semibold">Incorrect</span>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
              allAnswered
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => router.push('/summary')}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
          >
            Return to Summaries
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
