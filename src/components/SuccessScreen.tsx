
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Award, Trophy, PartyPopper } from 'lucide-react';
import { Button } from './ui/button';
import { Badge as BadgeUI } from './ui/badge';

interface SuccessScreenProps {
  badgesEarned: number;
  pointsEarned: number;
  moduleName: string;
  onContinue?: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  badgesEarned,
  pointsEarned,
  moduleName,
  onContinue,
}) => {
  const navigate = useNavigate();
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-[80vh] bg-gradient-to-b from-green-50 to-white p-5 items-center justify-center">
      {/* Celebration header */}
      <div className="text-center mb-8 animate-fade-in">
        <PartyPopper className="h-16 w-16 mx-auto mb-4 text-moveinsync-orange" />
        <h1 className="text-3xl font-bold text-moveinsync-orange mb-2">Training Complete!</h1>
        <p className="text-gray-600 text-lg">{moduleName}</p>
      </div>

      {/* Rewards section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 w-full max-w-md animate-scale-in">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Rewards Earned</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Badges */}
          <div className="flex flex-col items-center p-4 bg-moveinsync-orange/10 rounded-xl">
            <Badge className="w-10 h-10 mb-2 text-moveinsync-orange" />
            <div className="flex items-end">
              <span className="text-2xl font-bold">{badgesEarned}</span>
              <span className="text-sm ml-1 mb-0.5 text-gray-500">badges</span>
            </div>
          </div>
          
          {/* Points */}
          <div className="flex flex-col items-center p-4 bg-moveinsync-purple/10 rounded-xl">
            <Award className="w-10 h-10 mb-2 text-moveinsync-purple" />
            <div className="flex items-end">
              <span className="text-2xl font-bold">{pointsEarned}</span>
              <span className="text-sm ml-1 mb-0.5 text-gray-500">points</span>
            </div>
          </div>
        </div>
        
        {/* Achievement message */}
        <div className="mt-6 text-center">
          <BadgeUI className="bg-green-100 text-green-800 mb-2">Achievement Unlocked</BadgeUI>
          <p className="text-gray-600">Safe Driver Badge</p>
        </div>
      </div>
      
      {/* Driver illustration */}
      <div className="mb-8 text-center py-4 px-8 bg-gray-50 rounded-full animate-fade-in">
        <Trophy className="h-12 w-12 mx-auto text-yellow-500" />
        <p className="text-sm text-gray-500 mt-2">Safe Driver Achievement</p>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex w-full max-w-md gap-4">
        <Button 
          onClick={handleReturnHome} 
          variant="outline" 
          className="flex-1"
        >
          Return Home
        </Button>
        
        {onContinue && (
          <Button 
            onClick={onContinue} 
            className="flex-1 bg-moveinsync-orange hover:bg-moveinsync-orange/90"
          >
            Next Module
          </Button>
        )}
      </div>
    </div>
  );
};

export default SuccessScreen;
