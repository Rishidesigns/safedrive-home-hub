import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

// Define the slide interface
export interface TrainingSlide {
  id: number;
  title: string;
  content: string;
  visualDescription: string;
  language?: 'en' | 'hi' | 'kn'; // English, Hindi, Kannada
}

// Define the module interface
export interface TrainingModuleContent {
  id: string;
  name: string;
  slides: TrainingSlide[];
}
interface TrainingSlideViewerProps {
  moduleContent: TrainingModuleContent;
  onCompleteModule?: () => void;
  onExitModule?: () => void;
}
const TrainingSlideViewer: React.FC<TrainingSlideViewerProps> = ({
  moduleContent,
  onCompleteModule,
  onExitModule
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = moduleContent.slides.length;
  const currentSlide = moduleContent.slides[currentSlideIndex];
  const progressPercentage = (currentSlideIndex + 1) / totalSlides * 100;
  const goToNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onCompleteModule?.();
    }
  };
  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      goToNextSlide();
    } else if (e.key === 'ArrowLeft') {
      goToPreviousSlide();
    }
  };
  return <div className="flex flex-col h-full min-h-[80vh] bg-white" tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Module header */}
      <div className="bg-moveinsync-orange/10 px-4 py-3 text-center">
        <h2 className="font-medium text-slate-950 text-left text-2xl">{moduleContent.name}</h2>
        <div className="text-xs text-gray-600 mt-1 my-0 bg-transparent">
          Slide {currentSlideIndex + 1} of {totalSlides}
        </div>
      </div>
      
      {/* Progress bar */}
      <Progress value={progressPercentage} className="h-1 bg-gray-200" />
      
      {/* Slide content */}
      <div className="flex-1 flex flex-col p-5 pb-16">
        {/* Slide title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{currentSlide.title}</h1>
        
        {/* Visual */}
        <div className="w-full aspect-video bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-center p-4">
          {/* This would be replaced with an actual image in a real app */}
          <div className="text-gray-500">{currentSlide.visualDescription}</div>
        </div>
        
        {/* Content text */}
        <div className="text-lg leading-relaxed text-gray-700 mb-6">
          {currentSlide.content}
        </div>
      </div>
      
      {/* Navigation controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 flex justify-between">
        <Button onClick={goToPreviousSlide} disabled={currentSlideIndex === 0} variant="outline" className={cn("flex-1 mr-2", currentSlideIndex === 0 ? "opacity-50" : "")}>
          <ChevronLeft className="mr-1" /> Back
        </Button>
        
        <Button onClick={goToNextSlide} variant="default" className="flex-1 ml-2 bg-moveinsync-orange hover:bg-moveinsync-orange/90">
          {currentSlideIndex === totalSlides - 1 ? "Finish" : "Next"} <ChevronRight className="ml-1" />
        </Button>
      </div>
    </div>;
};
export default TrainingSlideViewer;