
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TrainingSlideViewer from '@/components/TrainingSlideViewer';
import TrainingQuiz from '@/components/TrainingQuiz';
import SuccessScreen from '@/components/SuccessScreen';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Get the module content
  const moduleContent = moduleId ? getModuleById(moduleId) : null;
  const quizContent = moduleId ? getQuizByModuleId(moduleId) : null;
  
  // Calculate rewards based on module content
  const badgesEarned = moduleContent ? moduleContent.slides.length : 0;
  
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
      // If there's no quiz, just complete the module and show success
      setShowSuccess(true);
    }
  };
  
  const handleCompleteQuiz = (score: number) => {
    setQuizScore(score);
    setShowSuccess(true);
  };
  
  const handleContinueToNextModule = () => {
    // In a real app, you would navigate to the next module
    // For now, just go back to the home screen
    navigate('/');
  };
  
  const handleExitModule = () => {
    navigate('/');
  };

  // Render success screen if module and quiz are completed
  if (showSuccess) {
    return (
      <SuccessScreen 
        badgesEarned={badgesEarned}
        pointsEarned={quizScore}
        moduleName={moduleContent.name}
        onContinue={handleContinueToNextModule}
      />
    );
  }

  // Render quiz if module is completed
  if (showQuiz && quizContent) {
    return (
      <TrainingQuiz 
        quizContent={quizContent}
        onCompleteQuiz={handleCompleteQuiz}
      />
    );
  }
  
  // Render slide viewer by default
  return (
    <TrainingSlideViewer 
      moduleContent={moduleContent}
      onCompleteModule={handleCompleteModule}
      onExitModule={handleExitModule}
    />
  );
};

export default TrainingSlide;
