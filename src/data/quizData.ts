
import { QuizContent } from '@/components/TrainingQuiz';

// Quiz for Safe Driving Practices module
export const safeDrivingQuiz: QuizContent = {
  id: 'quiz-1',
  moduleId: '1', // Corresponds to the Safe Driving Practices module
  questions: [
    {
      id: 1,
      text: 'What should you do if you feel tired during a trip?',
      options: [
        {
          id: 'a',
          text: 'Keep driving anyway',
          isCorrect: false,
          explanation: 'Driving tired increases accident risk.'
        },
        {
          id: 'b',
          text: 'Call supervisor and rest a bit',
          isCorrect: true,
          explanation: 'Taking a break when tired is the safest choice.'
        },
        {
          id: 'c',
          text: 'Speed up to finish faster',
          isCorrect: false,
          explanation: 'Speeding when tired is extremely dangerous.'
        }
      ]
    }
  ]
};

// Map module IDs to their respective quizzes
export const getQuizByModuleId = (moduleId: string): QuizContent | null => {
  if (moduleId === '1') {
    return safeDrivingQuiz;
  }
  
  // Add more quizzes here as needed
  
  return null;
};
