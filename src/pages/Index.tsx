
import React from 'react';
import TrainingHeroCard from '@/components/TrainingHeroCard';
import TrainingCard from '@/components/TrainingCard';
import TrainingHeader from '@/components/TrainingHeader';
import { trainingModules, userProgress } from '@/data/trainingData';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="max-w-md mx-auto px-4">
        <TrainingHeader />
        
        {/* Hero Card */}
        <TrainingHeroCard 
          badgesEarned={userProgress.badgesEarned}
          totalPoints={userProgress.totalPoints}
          modulesCompleted={userProgress.modulesCompleted}
        />
        
        {/* Training List */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Training Modules</h2>
        </div>
        
        <div className="space-y-3">
          {trainingModules.map((module) => (
            <TrainingCard 
              key={module.id}
              id={module.id}
              name={module.name}
              slides={module.slides}
              badges={module.badges}
              status={module.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
