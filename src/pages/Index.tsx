
import React from 'react';
import { Link } from 'react-router-dom';
import TrainingHeroCard from '@/components/TrainingHeroCard';
import TrainingCard from '@/components/TrainingCard';
import TrainingHeader from '@/components/TrainingHeader';
import { useQuery } from '@tanstack/react-query';
import { getTrainingModules, getSlideCount } from '@/services/trainingService';
import { TrainingStatus } from '@/components/StatusChip';

const Index: React.FC = () => {
  // Fetch published training modules
  const { data: modules = [], isLoading: isLoadingModules } = useQuery({
    queryKey: ['publishedModules'],
    queryFn: async () => {
      const allModules = await getTrainingModules();
      return allModules.filter(module => module.status === 'published');
    }
  });

  // For each module, fetch its slide count
  const { data: modulesWithSlideCounts = [], isLoading: isLoadingCounts } = useQuery({
    queryKey: ['moduleSlideCounts', modules],
    queryFn: async () => {
      const enrichedModules = await Promise.all(
        modules.map(async (module) => {
          const slideCount = await getSlideCount(module.id!);
          return {
            ...module,
            slideCount
          };
        })
      );
      return enrichedModules;
    },
    enabled: modules.length > 0
  });

  // Calculate user progress summary
  const userProgress = {
    badgesEarned: 3,
    totalPoints: 150,
    modulesCompleted: 1
  };

  const isLoading = isLoadingModules || isLoadingCounts;

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
            {modulesWithSlideCounts.map((module) => (
              <TrainingCard 
                key={module.id}
                id={module.id!}
                name={module.title}
                slides={module.slideCount} // Use the actual slide count
                badges={module.slideCount} // Set badges equal to slide count
                status={"pending" as TrainingStatus} // Use a valid TrainingStatus
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
