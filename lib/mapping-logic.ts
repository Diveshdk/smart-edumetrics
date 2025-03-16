import { CourseOutcome, StudentScore, AttainmentLevel } from './types';

// Calculate attainment level based on score percentage
export function calculateAttainmentLevel(percentage: number): number {
  if (percentage >= 80) return 3;
  if (percentage >= 70) return 2;
  return 1;
}

// Calculate CO attainment from student scores
export function calculateCOAttainment(
  scores: StudentScore[],
  threshold: number = 60
): number {
  const totalStudents = scores.length;
  const studentsAboveThreshold = scores.filter(
    score => (score.score / score.maxScore) * 100 >= threshold
  ).length;
  
  return (studentsAboveThreshold / totalStudents) * 100;
}

// Calculate PO attainment using CO-PO mapping and CO attainment
export function calculatePOAttainment(
  co: CourseOutcome,
  coAttainmentPercentage: number,
  poId: string
): AttainmentLevel {
  const mappingLevel = co.mappingLevels[poId] || 0;
  const weightedAttainment = (coAttainmentPercentage * mappingLevel) / 3;
  
  return {
    coId: co.id,
    poId,
    level: calculateAttainmentLevel(weightedAttainment),
    percentage: weightedAttainment
  };
}
