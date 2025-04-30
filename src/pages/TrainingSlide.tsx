
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TrainingSlideViewer from '@/components/TrainingSlideViewer';
import TrainingQuiz from '@/components/TrainingQuiz';
import { safeDrivingPracticesModule } from '@/data/safetyTrainingData';
import { getQuizByModuleId } from '@/data/quizData';
import { toast } from '@/hooks/use-toast';

// In a real app, this would fetch the module based on the ID
const getModuleById = (id: string) => {
  // For now, we only have one module
  if (id === '1') {
    return safeDrivingPracticesModule;
  }
  return null;
};

const TrainingSlide: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Get the module content
  const moduleContent = moduleId ? getModuleById(moduleId) : null;
  const quizContent = moduleId ? getQuizByModuleId(moduleId) : null;
  
  if (!moduleContent) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-xl font-bold">Module not found</h1>
        <button 
          className="mt-4 px-4 py-2 bg-moveinsync-orange text-white rounded-md"
          onClick={() => navigate('/')}
        >
          Return to Training Home
        </button>
      </div>
    );
  }
  
  const handleCompleteModule = () => {
    if (quizContent) {
      setShowQuiz(true);
    } else {
      // If there's no quiz, just complete the module
      toast({
        title: "Module Completed!",
        description: "You have earned badges and points for completing this module.",
      });
      navigate('/');
    }
  };
  
  const handleCompleteQuiz = (score: number) => {
    toast({
      title: "Quiz Completed!",
      description: `You scored ${score} points and earned badges!`,
    });
    navigate('/');
  };
  
  const handleExitModule = () => {
    navigate('/');
  };

  return showQuiz && quizContent ? (
    <TrainingQuiz 
      quizContent={quizContent}
      onCompleteQuiz={handleCompleteQuiz}
    />
  ) : (
    <TrainingSlideViewer 
      moduleContent={moduleContent}
      onCompleteModule={handleCompleteModule}
      onExitModule={handleExitModule}
    />
  );
};

export default TrainingSlide;
