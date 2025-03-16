"use client";

import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Subject, StudentAssessmentScore, ScoreDistribution } from "@/lib/types";
import { LucideArrowLeft, LucideUpload } from "lucide-react";
import * as XLSX from 'xlsx';

interface SubjectScoresProps {
  subject: Subject;
  onBack: () => void;
}

export function SubjectScores({ subject, onBack }: SubjectScoresProps) {
  const [activeAssessment, setActiveAssessment] = useState(subject.directAssessments[0]?.name || '');
  const [scores, setScores] = useState<StudentAssessmentScore[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistribution>({
    score1Count: 0,
    score2Count: 0,
    score3Count: 0,
    averageScore: 0
  });
  const [coWiseDistribution, setCoWiseDistribution] = useState<{ [co: string]: ScoreDistribution }>({});

  const calculateScoreOutOf3 = (score: number, maxMarks: number, threshold2: number, threshold3: number): number => {
    const percentage = (score / maxMarks) * 100;
    if (percentage >= threshold3) return 3;
    if (percentage >= threshold2) return 2;
    return 1;
  };

  const updateScoreDistribution = useCallback(() => {
    const assessment = subject.directAssessments.find(a => a.name === activeAssessment) || { coMarks: {} };
    const newCoWiseDistribution: { [co: string]: ScoreDistribution } = {};
  
    Object.keys(assessment.coMarks).forEach(co => {
      const currentScores = scores.filter(s => s.assessmentType === activeAssessment && s.coId === co);
      const distribution = currentScores.reduce(
        (acc, score) => {
          if (score.scoreOutOf3 === 3) acc.score3Count++;
          else if (score.scoreOutOf3 === 2) acc.score2Count++;
          else if (score.scoreOutOf3 === 1) acc.score1Count++;
          return acc;
        },
        { score1Count: 0, score2Count: 0, score3Count: 0, averageScore: 0 }
      );
  
      let totalScores = 0;
      if (currentScores.length > 0) {
        totalScores = currentScores.reduce((sum, score) => sum + (score.scoreOutOf3 || 0), 0);
      }
      distribution.averageScore = currentScores.length > 0 ? totalScores / currentScores.length : 0;
      newCoWiseDistribution[co] = distribution;
    });
    setCoWiseDistribution(newCoWiseDistribution);
  
    const allScores = scores.filter(s => s.assessmentType === activeAssessment);
    const overallDistribution = allScores.reduce(
      (acc, score) => {
        if (score.scoreOutOf3 === 3) acc.score3Count++;
        else if (score.scoreOutOf3 === 2) acc.score2Count++;
        else if (score.scoreOutOf3 === 1) acc.score1Count++;
        return acc;
      },
      { score1Count: 0, score2Count: 0, score3Count: 0, averageScore: 0 }
    );
  
    let totalOverallScores = 0;
    if (allScores.length > 0) {
      totalOverallScores = allScores.reduce((sum, score) => sum + (score.scoreOutOf3 || 0), 0);
    }
    overallDistribution.averageScore = allScores.length > 0 ? totalOverallScores / allScores.length : 0;
    setScoreDistribution(overallDistribution);
  }, [scores, activeAssessment, subject]);

  const updateCoWiseDistribution = useCallback(() => {
    const assessment = subject.directAssessments.find(a => a.name === activeAssessment);
    if (!assessment) return;

    const newCoWiseDistribution: { [co: string]: ScoreDistribution } = {};
    Object.keys(assessment.coMarks).forEach(co => {
      const currentScores = scores.filter(s => s.assessmentType === activeAssessment && s.coId === co);
      const distribution = currentScores.reduce(
        (acc, score) => {
          if (score.scoreOutOf3 === 3) acc.score3Count++;
          else if (score.scoreOutOf3 === 2) acc.score2Count++;
          else if (score.scoreOutOf3 === 1) acc.score1Count++;
          return acc;
        },
        { score1Count: 0, score2Count: 0, score3Count: 0, averageScore: 0 }
      );

      let totalScores = 0;
      if (currentScores.length > 0) {
        totalScores = currentScores.reduce((sum, score) => sum + (score.scoreOutOf3 || 0), 0);
      }
      distribution.averageScore = totalScores / (currentScores.length || 1);
      newCoWiseDistribution[co] = distribution;
    });
    setCoWiseDistribution(newCoWiseDistribution);
  }, [scores, activeAssessment, subject]);

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const newScores: StudentAssessmentScore[] = [];
      const rollNumbers = new Set<string>(); // To track unique roll numbers
  
      jsonData.forEach((row: any, index) => {
        const score = Number(row.Score) || 0;
        const rollNumber = `${index + 1}`.padStart(2, '0');
  
        // Check if the roll number is already processed
        if (!rollNumbers.has(rollNumber)) {
          rollNumbers.add(rollNumber); // Add roll number to the set
  
          // Check if a score already exists for this rollNumber and assessmentType
          const existingScore = scores.find(s => s.rollNumber === rollNumber && s.assessmentType === 'indirect');
  
          if (!existingScore) {
            // If no score exists, create a new one
            newScores.push({
              rollNumber: rollNumber,
              assessmentType: 'indirect',
              score: score,
              coId: "CO1"
            });
          } else {
            // If a score already exists, update it
            existingScore.score = score;
            newScores.push(existingScore);
          }
        }
      });

      setScores(prev => {
        const filteredScores = prev.filter(s => s.assessmentType !== 'indirect');
        return [...filteredScores, ...newScores];
      });
      updateScoreDistribution();
      updateCoWiseDistribution();
    };
    reader.readAsArrayBuffer(file);
  };

  const initializeScores = useCallback((assessmentType: string) => {
    const existingScores = scores.filter(s => s.assessmentType === assessmentType);
    if (existingScores.length === 0) {
      const assessment = subject.directAssessments.find(a => a.name === assessmentType);
      const maxMarks = assessment?.maxMarks || subject.indirectAssessment.maxMarks;

      const newScores = Array.from({ length: subject.studentCount }, (_, i) => {
        const rollNumber = `${i + 1}`.padStart(2, '0');
        return Object.keys(assessment?.coMarks || {}).map(co => ({
          rollNumber,
          assessmentType,
          score: 0,
          scoreOutOf3: 1,
          coId: co
        }));
      }).flat();
      setScores(prev => {
        // Filter out any existing scores for the current assessmentType to avoid duplicates
        const filteredScores = prev.filter(s => !(s.assessmentType === assessmentType && newScores.some(ns => ns.rollNumber === s.rollNumber && ns.coId === s.coId)));
        return [...filteredScores, ...newScores];
      });
    }
  }, [scores, subject]);

  const updateScore = (rollNumber: string, assessmentType: string, coId: string, value: number) => {
    const assessment = subject.directAssessments.find(a => a.name === assessmentType);
    if (!assessment) return;

    const coMarks: { [key: string]: number } = assessment?.coMarks || {};
    const maxMarksForCo = coMarks[coId] || 0;

    let newScore = value;
    let newScoreOutOf3 = 1;

    if (value > maxMarksForCo) {
      newScore = maxMarksForCo;
    }

    const percentage = (newScore / maxMarksForCo) * 100;
    if (percentage >= subject.threshold3) {
      newScoreOutOf3 = 3;
    } else if (percentage >= subject.threshold2) {
      newScoreOutOf3 = 2;
    } else {
      newScoreOutOf3 = 1;
    }

    setScores(prevScores => {
      const updatedScores = prevScores.map(score => {
        if (score.rollNumber === rollNumber && score.assessmentType === assessmentType && score.coId === coId) {
          return {
            ...score,
            score: newScore,
            scoreOutOf3: newScoreOutOf3
          };
        }
        return score;
      });
      updateScoreDistribution();
      updateCoWiseDistribution();
      return updatedScores;
    });
  };

  useEffect(() => {
    if (activeAssessment) {
      initializeScores(activeAssessment);
      updateScoreDistribution();
      updateCoWiseDistribution();
    }
  }, [activeAssessment, subject, updateScoreDistribution, updateCoWiseDistribution, initializeScores, scores]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack}>
          <LucideArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{subject.name} - Assessment Scores</h1>
      </div>

      <Card className="p-6">
        <Tabs
          value={activeAssessment}
          onValueChange={(value) => {
            setActiveAssessment(value);
            initializeScores(value);
          }}
          className="space-y-4"
        >
          <TabsList className="flex flex-wrap gap-2">
            {subject.directAssessments.map((assessment) => (
              <TabsTrigger
                key={assessment.name}
                value={assessment.name}
                className="flex-1"
              >
                {assessment.name} ({assessment.weightage}%)
              </TabsTrigger>
            ))}
            <TabsTrigger value="indirect" className="flex-1">
              Indirect Assessment (20%)
            </TabsTrigger>
          </TabsList>

          {subject.directAssessments.map((assessment) => (
            <TabsContent key={assessment.name} value={assessment.name}>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{assessment.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Maximum Marks: {assessment.maxMarks}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Roll No</th>
                        {Object.keys(assessment.coMarks).map(co => (
                          <th key={co} className="text-left p-2">
                            {co}
                            <br />
                            (Out of {assessment.coMarks[co as keyof typeof assessment.coMarks]})
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: subject.studentCount }, (_, i) => {
                        const rollNumber = `${i + 1}`.padStart(2, '0');
                        return (
                          <tr key={rollNumber} className="border-b">
                            <td className="p-2">{rollNumber}</td>
                            {Object.keys(assessment.coMarks).map(co => {
                              const studentScore = scores.find(
                                s => s.rollNumber === rollNumber && s.assessmentType === assessment.name && s.coId === co
                              );
                              const maxMarksForCo = assessment.coMarks[co as keyof typeof assessment.coMarks];
                              return (
                                <td key={co} className="p-2">
                                  <Input
                                    type="number"
                                    value={studentScore?.score || 0}
                                    onChange={(e) => {
                                      const value = Number(e.target.value);
                                      updateScore(rollNumber, assessment.name, co, value);
                                    }}
                                    min="0"
                                    max={maxMarksForCo}
                                    className="w-24"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Card className="p-4 bg-muted/50">
                  <h3 className="font-semibold mb-2">Score Distribution</h3>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Score 1:</p>
                      <p className="font-medium">{scoreDistribution.score1Count} students</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Score 2:</p>
                      <p className="font-medium">{scoreDistribution.score2Count} students</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Score 3:</p>
                      <p className="font-medium">{scoreDistribution.score3Count} students</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Average Score:</p>
                      <p className="font-medium">{scoreDistribution.averageScore.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-muted/50">
                  <h3 className="font-semibold mb-2">CO-wise Score Distribution</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {Object.keys(coWiseDistribution).map(co => (
                      <div key={co}>
                        <h4 className="font-medium">{co}</h4>
                        <div>
                          <p className="text-muted-foreground">Score 1:</p>
                          <p className="font-medium">{coWiseDistribution[co].score1Count} students</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Score 2:</p>
                          <p className="font-medium">{coWiseDistribution[co].score2Count} students</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Score 3:</p>
                          <p className="font-medium">{coWiseDistribution[co].score3Count} students</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Average Score:</p>
                          <p className="font-medium">{coWiseDistribution[co].averageScore.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          ))}

          <TabsContent value="indirect">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Course Exit Survey</h2>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    Maximum Marks: {subject.indirectAssessment.maxMarks}
                  </p>
                  <div>
                    <input
                      type="file"
                      id="excel-upload"
                      className="hidden"
                      accept=".xlsx,.xls"
                      onChange={handleExcelUpload}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('excel-upload')?.click()}
                    >
                      <LucideUpload className="w-4 h-4 mr-2" />
                      Upload Excel
                    </Button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Roll No</th>
                      <th className="text-left p-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: subject.studentCount }, (_, i) => {
                      const rollNumber = `${i + 1}`.padStart(2, '0');
                      const studentScore = scores.find(
                        s => s.rollNumber === rollNumber && s.assessmentType === 'indirect'
                      );

                      return (
                        <tr key={rollNumber} className="border-b">
                          <td className="p-2">{rollNumber}</td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={studentScore?.score || 0}
                              onChange={(e) => updateScore(rollNumber, 'indirect', 'CO1', Number(e.target.value))}
                              min="0"
                              max={subject.indirectAssessment.maxMarks}
                              className="w-32"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <Card className="p-4 bg-muted/50">
                <h3 className="font-semibold mb-2">Score Distribution</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Score 1:</p>
                    <p className="font-medium">{scoreDistribution.score1Count} students</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Score 2:</p>
                    <p className="font-medium">{scoreDistribution.score2Count} students</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Score 3:</p>
                    <p className="font-medium">{scoreDistribution.score3Count} students</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average Score:</p>
                    <p className="font-medium">{scoreDistribution.averageScore.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
