export interface CourseOutcome {
  id: string;
  description: string;
  mappingLevels: {
    [key: string]: number; // PO1, PO2, etc. -> mapping level (1, 2, or 3)
  };
  maxMarks: number;
}

export interface StudentScore {
  id: string;
  coId: string;
  score: number;
  maxScore: number;
}

export interface AttainmentLevel {
  coId: string;
  poId: string;
  level: number;
  percentage: number;
}

export interface AnalyticsData {
  courseOutcomes: CourseOutcome[];
  studentScores: StudentScore[];
  attainmentLevels: AttainmentLevel[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  threshold2: number;
  threshold3: number;
  studentCount: number;
  courseOutcomes: CourseOutcome[];
  directAssessments: DirectAssessmentType[];
  indirectAssessment: IndirectAssessmentType;
}

export interface DirectAssessmentType {
  name: string;
  weightage: number;
  maxMarks: number;
  coMarks: {
    CO1: number;
    CO2: number;
    CO3: number;
    CO4: number;
    CO5: number;
    CO6: number;
  };
}

export interface IndirectAssessmentType {
  weightage: number; // Fixed at 20%
  maxMarks: number;
}

export interface StudentAssessmentScore {
  rollNumber: string;
  assessmentType: string;
  score: number;
  scoreOutOf3?: number;
  coId: string;
}

export interface ScoreDistribution {
  score1Count: number;
  score2Count: number;
  score3Count: number;
  averageScore: number;
}

export interface GeminiAnalysis {
  averageScore: number;
  feedback: string;
  recommendations: string[];
}
