
import { TrainingStatus } from '@/components/StatusChip';

export interface TrainingModule {
  id: string;
  name: string;
  slides: number;
  badges: number;
  status: TrainingStatus;
}

// Mock data for training modules
export const trainingModules: TrainingModule[] = [
  {
    id: '1',
    name: 'Safe Driving Practices',
    slides: 12,
    badges: 2,
    status: 'completed'
  },
  {
    id: '2',
    name: 'Passenger Etiquette',
    slides: 8,
    badges: 1,
    status: 'completed'
  },
  {
    id: '3',
    name: 'Road Safety Guidelines',
    slides: 15,
    badges: 2,
    status: 'pending'
  },
  {
    id: '4',
    name: 'Vehicle Maintenance Basics',
    slides: 10,
    badges: 1,
    status: 'overdue'
  },
  {
    id: '5',
    name: 'Emergency Protocols',
    slides: 7,
    badges: 3,
    status: 'pending'
  },
  {
    id: '6',
    name: 'Fuel Efficiency Techniques',
    slides: 9,
    badges: 1,
    status: 'pending'
  },
  {
    id: '7',
    name: 'Customer Service Excellence',
    slides: 11,
    badges: 2,
    status: 'pending'
  }
];

// User progress data
export const userProgress = {
  badgesEarned: 3,
  totalPoints: 150,
  modulesCompleted: 2
};
