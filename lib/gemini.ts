import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function analyzeIndirectAssessment(excelData: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Analyze this course exit survey data and provide:
1. Calculate the average score
2. Brief feedback about student satisfaction
3. Key recommendations for improvement

Data: ${JSON.stringify(excelData)}

Format the response as JSON with these keys:
{
  "averageScore": number,
  "feedback": string,
  "recommendations": string[]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());

    return analysis;
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    return {
      averageScore: calculateAverageScore(excelData),
      feedback: "Unable to generate AI feedback at this time.",
      recommendations: []
    };
  }
}

function calculateAverageScore(data: any[]): number {
  if (!data.length) return 0;
  const sum = data.reduce((acc, row) => acc + (Number(row.Score) || 0), 0);
  return sum / data.length;
}
