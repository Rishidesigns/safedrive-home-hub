
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TrainingSlideViewer from '@/components/TrainingSlideViewer';
import TrainingQuiz from '@/components/TrainingQuiz';
import SuccessScreen from '@/components/SuccessScreen';
import { getTrainingModule, getSlides, getQuizzes } from '@/services/trainingService';
import { toast } from '@/hooks/use-toast';

const TrainingSlide: React.FC = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();
  const [showQuiz, setShowQuiz] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Get the module content
  const { data: moduleContent, isLoading: isLoadingModule, error: moduleError } = useQuery({
    queryKey: ['trainingModule', moduleId],
    queryFn: () => moduleId ? getTrainingModule(moduleId) : null,
    enabled: !!moduleId
  });
  
  // Get the slides
  const { data: slides, isLoading: isLoadingSlides } = useQuery({
    queryKey: ['moduleSlides', moduleId],
    queryFn: () => moduleId ? getSlides(moduleId) : [],
    enabled: !!moduleId
  });
  
  // Get the quiz content
  const { data: quizQuestions, isLoading: isLoadingQuiz } = useQuery({
    queryKey: ['moduleQuiz', moduleId],
    queryFn: () => moduleId ? getQuizzes(moduleId) : [],
    enabled: !!moduleId
  });
  
  // Create formatted slide data for the viewer component
  const formattedSlides = slides?.map(slide => ({
    id: Number(slide.id?.split('-')[0] || 0),
    title: slide.hero_text,
    content: slide.description || '',
    visualDescription: '',
    order: slide.order
  })).sort((a, b) => a.order - b.order) || [];
  
  // Format quiz questions for the quiz component
  const formattedQuiz = {
    id: moduleId || '1',
    moduleId: moduleId || '1',
    questions: quizQuestions?.map(q => ({
      id: Number(q.id?.split('-')[0] || 0),
      text: q.question,
      options: [
        { id: 'A', text: q.option_a, isCorrect: q.correct_option === 'A', explanation: q.explanation || undefined },
        { id: 'B', text: q.option_b, isCorrect: q.correct_option === 'B', explanation: q.explanation || undefined },
        ...(q.option_c ? [{ id: 'C', text: q.option_c, isCorrect: q.correct_option === 'C', explanation: q.explanation || undefined }] : []),
        ...(q.option_d ? [{ id: 'D', text: q.option_d, isCorrect: q.correct_option === 'D', explanation: q.explanation || undefined }] : [])
      ]
    })) || []
  };
  
  // Calculate rewards based on module content
  const badgesEarned = formattedSlides.length > 0 ? formattedSlides.length : 0;
  
  if (isLoadingModule || isLoadingSlides) {
    return <div className="flex justify-center items-center h-screen">Loading training content...</div>;
  }
  
  if (moduleError || !moduleContent) {
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
    if (quizQuestions && quizQuestions.length > 0) {
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
        moduleName={moduleContent.title}
        onContinue={handleContinueToNextModule}
      />
    );
  }

  // Render quiz if module is completed
  if (showQuiz && formattedQuiz.questions.length > 0) {
    return (
      <TrainingQuiz 
        quizContent={formattedQuiz}
        onCompleteQuiz={handleCompleteQuiz}
      />
    );
  }
  
  // Render slide viewer by default
  return (
    <TrainingSlideViewer 
      moduleContent={{
        id: moduleContent.id || '1',
        name: moduleContent.title,
        slides: formattedSlides
      }}
      onCompleteModule={handleCompleteModule}
      onExitModule={handleExitModule}
    />
  );
};

export default TrainingSlide;
