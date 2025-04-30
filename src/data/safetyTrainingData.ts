
import { TrainingModuleContent } from '@/components/TrainingSlideViewer';

export const safeDrivingPracticesModule: TrainingModuleContent = {
  id: '1',
  name: 'Safe Driving Practices',
  slides: [
    {
      id: 1,
      title: 'Your Safety Comes First',
      content: "A safe driver is a reliable driver. Let's learn how to keep yourself fit and alert while on duty. ಮುಖ್ಯವಾಗಿದೆ.",
      visualDescription: 'Drive safely with proper seat belt and posture'
    },
    {
      id: 2,
      title: 'Be Well-Rested Before Duty',
      content: 'Always get enough sleep before duty. A tired mind causes accidents.',
      visualDescription: 'Get proper rest before starting your shift'
    },
    {
      id: 3,
      title: 'Eat Before You Drive',
      content: 'Never skip meals. An empty stomach can make you feel weak and dizzy while driving.',
      visualDescription: 'Have a balanced meal for energy and focus'
    },
    {
      id: 4,
      title: 'Don\'t Drive if You\'re Unwell',
      content: 'Feeling sick? Took medicine? Had alcohol? Take a day off and inform your supervisor.',
      visualDescription: 'Stay home if you feel sick or unwell'
    },
    {
      id: 5,
      title: 'Take a Break When Fatigued',
      content: 'If you feel tired mid-trip, take a short break. Park safely and rest for a few minutes.',
      visualDescription: 'Take regular breaks during long drives'
    }
  ]
};
