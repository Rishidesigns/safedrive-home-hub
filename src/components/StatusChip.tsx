
import React from 'react';
import { cn } from '@/lib/utils';

export type TrainingStatus = 'pending' | 'overdue' | 'completed';

interface StatusChipProps {
  status: TrainingStatus;
  className?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({ status, className }) => {
  const statusClasses = {
    pending: 'status-chip-pending',
    overdue: 'status-chip-overdue',
    completed: 'status-chip-completed'
  };

  return (
    <span className={cn('status-chip', statusClasses[status], className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusChip;
