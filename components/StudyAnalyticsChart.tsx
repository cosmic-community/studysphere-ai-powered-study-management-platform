'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart } from 'recharts'

interface StudyAnalyticsChartProps {
  data: Array<{
    day: string
    studyTime: number
    quizScore: number
  }>
}

export default function StudyAnalyticsChart({ data }: StudyAnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No data available</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            className="text-sm text-gray-600"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            className="text-sm text-gray-600"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value: number, name: string) => [
              name === 'studyTime' ? `${value} min` : `${value}%`,
              name === 'studyTime' ? 'Study Time' : 'Quiz Score'
            ]}
          />
          <Bar 
            dataKey="studyTime" 
            fill="#0ea5e9" 
            radius={[4, 4, 0, 0]}
            name="studyTime"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}