"use client";

import { Card } from "@/components/ui/card";
import { mockAnalyticsData } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export function Analytics() {
  // Transform data for visualization
  const chartData = mockAnalyticsData.courseOutcomes.map(co => {
    const data: any = { name: co.id };
    Object.entries(co.mappingLevels).forEach(([po, level]) => {
      data[po] = level;
    });
    return data;
  });

  const attainmentData = mockAnalyticsData.attainmentLevels.map(al => ({
    name: `${al.coId}-${al.poId}`,
    Attainment: al.percentage
  }));

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">CO-PO Mapping Levels</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="PO1" fill="hsl(var(--chart-1))" />
              <Bar dataKey="PO2" fill="hsl(var(--chart-2))" />
              <Bar dataKey="PO3" fill="hsl(var(--chart-3))" />
              <Bar dataKey="PO4" fill="hsl(var(--chart-4))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Attainment Levels</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attainmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Legend />
              <Bar dataKey="Attainment" fill="hsl(var(--chart-5))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Based on the current data analysis:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Strong correlation between CO2 and PO2 achievement levels</li>
            <li>CO3 shows highest overall attainment across mapped POs</li>
            <li>Recommended focus areas: Strengthening CO1-PO3 mapping implementation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
