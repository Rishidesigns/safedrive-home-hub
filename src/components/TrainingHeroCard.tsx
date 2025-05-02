
import React from 'react';
import { Badge, Award, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrainingHeroCardProps {
  badgesEarned: number;
  totalPoints: number;
  modulesCompleted: number;
}

const TrainingHeroCard: React.FC<TrainingHeroCardProps> = ({
  badgesEarned,
  totalPoints,
  modulesCompleted
}) => {
  return (
    <div className="bg-gradient-to-br from-moveinsync-blue to-moveinsync-green rounded-2xl p-5 shadow-lg text-white mb-6">
      <h2 className="text-lg font-semibold mb-4">Your Training Progress</h2>
      
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center p-3 bg-white/20 rounded-xl">
          <Badge className="w-7 h-7 mb-1 animate-badge-earned" />
          <span className="text-xl font-bold">{badgesEarned}</span>
          <span className="text-xs text-white/80">Badges</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl">
          <Award className="w-7 h-7 mb-1" />
          <span className="text-xl font-bold">{totalPoints}</span>
          <span className="text-xs text-white/80">Points</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-white/10 rounded-xl">
          <CheckCircle className="w-7 h-7 mb-1" />
          <span className="text-xl font-bold">{modulesCompleted}</span>
          <span className="text-xs text-white/80">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default TrainingHeroCard;
