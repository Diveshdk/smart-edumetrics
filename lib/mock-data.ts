import { AnalyticsData } from './types';

// Mock data for demonstration
export const mockAnalyticsData: AnalyticsData = {
  courseOutcomes: [
    {
      id: 'CO1',
      description: 'Apply mathematical foundations for analyzing algorithms',
      mappingLevels: { PO1: 3, PO2: 2, PO3: 1, PO4: 2 },
      maxMarks: 0
    },
    {
      id: 'CO2',
      description: 'Design efficient algorithms using different paradigms',
      mappingLevels: { PO1: 2, PO2: 3, PO3: 2, PO4: 1 },
      maxMarks: 0
    },
    {
      id: 'CO3',
      description: 'Implement and analyze graph algorithms',
      mappingLevels: { PO1: 1, PO2: 3, PO3: 3, PO4: 2 },
      maxMarks: 0
    }
  ],
  studentScores: [
    { id: '1', coId: 'CO1', score: 85, maxScore: 100 },
    { id: '2', coId: 'CO2', score: 78, maxScore: 100 },
    { id: '3', coId: 'CO3', score: 92, maxScore: 100 }
  ],
  attainmentLevels: [
    { coId: 'CO1', poId: 'PO1', level: 3, percentage: 85 },
    { coId: 'CO1', poId: 'PO2', level: 2, percentage: 70 },
    { coId: 'CO2', poId: 'PO1', level: 2, percentage: 78 },
    { coId: 'CO2', poId: 'PO2', level: 3, percentage: 82 },
    { coId: 'CO3', poId: 'PO1', level: 1, percentage: 60 },
    { coId: 'CO3', poId: 'PO2', level: 3, percentage: 92 }
  ]
};
