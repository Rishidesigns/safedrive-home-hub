
import React from 'react';
import { Link } from 'react-router-dom';
import TrainingHeroCard from '@/components/TrainingHeroCard';
import TrainingCard from '@/components/TrainingCard';
import TrainingHeader from '@/components/TrainingHeader';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModules } from '@/services/trainingService';

const Index: React.FC = () => {
  // Fetch published training modules
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['publishedModules'],
    queryFn: async () => {
      const allModules = await getTrainingModules();
      return allModules.filter(module => module.status === 'published');
    }
  });

  // Calculate user progress summary
  const userProgress = {
    badgesEarned: 3,
    totalPoints: 150,
    modulesCompleted: 1
  };

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
        
        {isLoading ? (
          <div className="text-center py-4">Loading training modules...</div>
        ) : (
          <div className="space-y-3">
            {modules.map((module) => (
              <TrainingCard 
                key={module.id}
                id={module.id!}
                name={module.title}
                slides={[]} // This would be filled with actual slide count
                badges={3} // This would be dynamic based on module badges
                status="available" // This would be dynamic based on user progress
              />
            ))}
          </div>
        )}
        
        {/* Admin Link */}
        <div className="mt-8 text-center">
          <Link 
            to="/admin" 
            className="text-sm text-gray-500 hover:text-moveinsync-orange"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
