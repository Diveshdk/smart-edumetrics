"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Upload as LucideUpload,
  List as LucideList,
  Users as LucideUsers,
  BarChart as LucideBarChart,
  Plus as LucidePlus,
  ChevronRight as LucideChevronRight,
} from "lucide-react";
import { Analytics } from "./analytics";
import { Subject, DirectAssessmentType } from "@/lib/types";
import { SubjectScores } from "./subject-scores";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("upload");
  const [directAssessments, setDirectAssessments] = useState<DirectAssessmentType[]>([
    { name: '', weightage: 0, maxMarks: 0, coMarks: { CO1: 0, CO2: 0, CO3: 0, CO4: 0, CO5: 0, CO6: 0 } }
  ]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const addDirectAssessment = () => {
    setDirectAssessments([...directAssessments, {
      name: '',
      weightage: 0,
      maxMarks: 0,
      coMarks: { CO1: 0, CO2: 0, CO3: 0, CO4: 0, CO5: 0, CO6: 0 }
    }]);
  };

  const handleDirectAssessmentChange = (index: number, field: "name" | "weightage" | "maxMarks", value: string) => {
    const newTypes = [...directAssessments];
    if (field === 'name') {
      newTypes[index].name = value;
    } else {
      newTypes[index][field] = Number(value);
    }
    setDirectAssessments(newTypes);
  };

  const handleCoMarksChange = (index: number, co: keyof DirectAssessmentType['coMarks'], value: string) => {
    const newTypes = [...directAssessments];
    newTypes[index].coMarks[co] = Number(value);
    setDirectAssessments(newTypes);
  };

  const calculateTotalWeightage = () => {
    return directAssessments.reduce((sum, assessment) => sum + assessment.weightage, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    // Validate total weightage
    const totalDirectWeightage = calculateTotalWeightage();
    if (totalDirectWeightage !== 80) {
      alert("Direct assessment weightage must total exactly 80%");
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: (form.subjectName as HTMLInputElement).value,
      code: (form.subjectCode as HTMLInputElement).value,
      threshold2: Number((form.threshold2 as HTMLInputElement).value),
      threshold3: Number((form.threshold3 as HTMLInputElement).value),
      studentCount: Number((form.studentCount as HTMLInputElement).value),
      courseOutcomes: [],
      directAssessments: directAssessments.filter(type => type.name && type.weightage && type.maxMarks),
      indirectAssessment: {
        weightage: 20,
        maxMarks: 100
      }
    };
    setSubjects([...subjects, newSubject]);
    form.reset();
    setDirectAssessments([{ name: '', weightage: 0, maxMarks: 0, coMarks: { CO1: 0, CO2: 0, CO3: 0, CO4: 0, CO5: 0, CO6: 0 } }]);
  };

  if (selectedSubject) {
    return <SubjectScores subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4 bg-muted p-1 rounded-lg">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <LucideUpload className="w-4 h-4" />
            <span>Add Subject</span>
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <LucideList className="w-4 h-4" />
            <span>Subjects</span>
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <LucideUsers className="w-4 h-4" />
            <span>Student Scores</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LucideBarChart className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Add New Subject</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subjectName">Subject Name</Label>
                  <Input id="subjectName" name="subjectName" placeholder="Enter subject name" required />
                </div>

                <div>
                  <Label htmlFor="subjectCode">Subject Code</Label>
                  <Input id="subjectCode" name="subjectCode" placeholder="Enter subject code" required />
                </div>

                <div>
                  <Label htmlFor="syllabus">Upload Syllabus (PDF)</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center mt-2">
                    <LucideUpload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-2">
                      Drag and drop your syllabus PDF file here, or click to select
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      id="syllabus"
                    />
                    <Button type="button" onClick={() => document.getElementById('syllabus')?.click()}>
                      Select File
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="threshold3">Threshold for Score 3 (%)</Label>
                    <Input
                      id="threshold3"
                      name="threshold3"
                      type="number"
                      placeholder="e.g., 80"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="threshold2">Threshold for Score 2 (%)</Label>
                    <Input
                      id="threshold2"
                      name="threshold2"
                      type="number"
                      placeholder="e.g., 60"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="studentCount">Number of Students</Label>
                  <Input
                    id="studentCount"
                    name="studentCount"
                    type="number"
                    placeholder="Enter total number of students"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Assessment Types</Label>
                  <div className="bg-muted/50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">
                      Direct Assessment (80%) - Specify assessment types and their weightage
                    </p>
                  </div>
                  <div className="space-y-4">
                    {directAssessments.map((type, index) => (
                      <div key={index} className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="Assessment name"
                            value={type.name}
                            onChange={(e) => handleDirectAssessmentChange(index, 'name', e.target.value)}
                            required={index === 0}
                          />
                          <Input
                            type="number"
                            placeholder="Weightage (%)"
                            value={type.weightage || ''}
                            onChange={(e) => handleDirectAssessmentChange(index, 'weightage', e.target.value)}
                            min="0"
                            max="80"
                            required={index === 0}
                          />
                          <Input
                            type="number"
                            placeholder="Max Marks"
                            value={type.maxMarks || ''}
                            onChange={(e) => handleDirectAssessmentChange(index, 'maxMarks', e.target.value)}
                            min="0"
                            required={index === 0}
                          />
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {(Object.keys(type.coMarks) as Array<keyof typeof type.coMarks>).map(co => (
                            <div key={co} className="flex flex-col">
                              <Label htmlFor={`${type.name}-${co}`}>{co}</Label>
                              <Input
                                type="number"
                                id={`${type.name}-${co}`}
                                placeholder="Marks"
                                value={type.coMarks[co]}
                                onChange={(e) => handleCoMarksChange(index, co, e.target.value)}
                                min="0"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      className="w-full"
                      onClick={addDirectAssessment}
                    >
                      <LucidePlus className="w-4 h-4 mr-2" />
                      Add Direct Assessment Type
                    </Button>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-muted-foreground">
                      Indirect Assessment (20%) - Fixed weightage for course exit survey
                    </p>
                  </div>
                </div>

                <Button type="submit" className="w-full">Create Subject</Button>
              </div>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Subjects</h2>
            <div className="space-y-4">
              {subjects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No subjects added yet. Add a subject to get started.
                </p>
              ) : (
                subjects.map(subject => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <div>
                      <h3 className="font-semibold">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                    <LucideChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
