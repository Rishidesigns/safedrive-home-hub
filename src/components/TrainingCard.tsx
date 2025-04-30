
import React from 'react';
import StatusChip, { TrainingStatus } from './StatusChip';
import { Badge, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface TrainingCardProps {
  id: string;
  name: string;
  slides: number;
  badges: number;
  status: TrainingStatus;
  className?: string;
}

const TrainingCard: React.FC<TrainingCardProps> = ({
  id,
  name,
  slides,
  badges,
  status,
  className,
}) => {
  return (
    <Link to={`/training/${id}`} className="block">
      <div className={cn("training-card", className)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-gray-800 pr-2 flex-1">{name}</h3>
          <StatusChip status={status} />
        </div>
        
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center">
            <BookOpen size={16} className="mr-1" />
            <span>{slides} slides</span>
          </div>
          
          <div className="flex items-center">
            <Badge size={16} className="mr-1 text-moveinsync-orange" />
            <span>{badges} {badges === 1 ? 'badge' : 'badges'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TrainingCard;
