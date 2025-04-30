
import React, { useState } from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { toast } from '@/hooks/use-toast';

// Define the quiz option interface
interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

// Define the quiz question interface
export interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

// Define the quiz content interface
export interface QuizContent {
  id: string;
  moduleId: string;
  questions: QuizQuestion[];
}

interface TrainingQuizProps {
  quizContent: QuizContent;
  onCompleteQuiz?: (score: number) => void;
}

const TrainingQuiz: React.FC<TrainingQuizProps> = ({
  quizContent,
  onCompleteQuiz
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  const totalQuestions = quizContent.questions.length;
  const currentQuestion = quizContent.questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  const handleSelectOption = (optionId: string) => {
    if (!isSubmitted) {
      setSelectedOptionId(optionId);
    }
  };
  
  const handleSubmit = () => {
    if (!selectedOptionId) return;
    
    const selectedOption = currentQuestion.options.find(opt => opt.id === selectedOptionId);
    
    if (selectedOption?.isCorrect) {
      // Correct answer
      setScore(score + 10);
      toast({
        title: "Correct! +10 points",
        description: "Great job! You've earned 10 points.",
      });
    }
    
    setIsSubmitted(true);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
    } else {
      // Quiz completed
      onCompleteQuiz?.(score);
    }
  };
  
  const getOptionClassName = (option: QuizOption) => {
    if (!isSubmitted) {
      return option.id === selectedOptionId 
        ? "border-moveinsync-orange bg-moveinsync-orange/10" 
        : "border-gray-200";
    }
    
    if (option.isCorrect) {
      return "border-green-500 bg-green-50";
    }
    
    if (option.id === selectedOptionId && !option.isCorrect) {
      return "border-red-500 bg-red-50";
    }
    
    return "border-gray-200 opacity-70";
  };
  
  return (
    <div className="flex flex-col h-full min-h-[80vh] bg-white">
      {/* Quiz header */}
      <div className="bg-moveinsync-orange/10 px-4 py-3 text-center">
        <h2 className="font-medium text-slate-950 text-center text-xl">Quiz</h2>
        <div className="text-xs text-gray-600 mt-1 my-0 bg-transparent">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>
      
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-1 bg-gray-200" />
      
      {/* Quiz content */}
      <div className="flex-1 flex flex-col p-5 pb-16">
        {/* Question */}
        <h1 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.text}</h1>
        
        {/* Options */}
        <RadioGroup 
          value={selectedOptionId || ""} 
          className="space-y-3"
          onValueChange={handleSelectOption}
        >
          {currentQuestion.options.map((option) => (
            <div 
              key={option.id}
              className={cn(
                "flex items-center p-4 rounded-lg border-2 transition-all", 
                getOptionClassName(option)
              )}
            >
              <div className="flex items-center flex-1">
                <RadioGroupItem 
                  value={option.id} 
                  id={option.id}
                  disabled={isSubmitted}
                  className="mr-3"
                />
                <Label 
                  htmlFor={option.id} 
                  className="flex-1 text-base cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
              
              {isSubmitted && option.isCorrect && (
                <CheckCircle className="h-5 w-5 text-green-500 ml-2" />
              )}
              
              {isSubmitted && !option.isCorrect && option.id === selectedOptionId && (
                <XCircle className="h-5 w-5 text-red-500 ml-2" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {/* Explanation when answer is incorrect */}
        {isSubmitted && selectedOptionId && !currentQuestion.options.find(opt => opt.id === selectedOptionId)?.isCorrect && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
            {currentQuestion.options.find(opt => opt.isCorrect)?.explanation || "That's not correct. Please try again."}
          </div>
        )}
        
        {/* Points display when answer is correct */}
        {isSubmitted && selectedOptionId && currentQuestion.options.find(opt => opt.id === selectedOptionId)?.isCorrect && (
          <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg text-sm text-green-700 flex items-center">
            <Award className="h-5 w-5 mr-2" />
            <span>+10 points earned!</span>
          </div>
        )}
      </div>
      
      {/* Navigation controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-between">
        {!isSubmitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedOptionId}
            className="w-full bg-moveinsync-orange hover:bg-moveinsync-orange/90"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            className="w-full bg-moveinsync-orange hover:bg-moveinsync-orange/90"
          >
            {currentQuestionIndex === totalQuestions - 1 ? "Complete Quiz" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrainingQuiz;
