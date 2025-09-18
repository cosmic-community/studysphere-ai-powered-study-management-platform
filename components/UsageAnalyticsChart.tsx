'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface UsageAnalyticsChartProps {
  data: Array<{
    date: string
    screenTime: number
    studyTime: number
    blockedTime: number
  }>
}

export default function UsageAnalyticsChart({ data }: UsageAnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No usage data available</p>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="studyTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="screenTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="blockedTime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
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
              `${value} min`,
              name === 'studyTime' ? 'Study Time' : 
              name === 'screenTime' ? 'Total Screen Time' : 'Blocked Time'
            ]}
          />
          <Area
            type="monotone"
            dataKey="screenTime"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#screenTime)"
            name="screenTime"
          />
          <Area
            type="monotone"
            dataKey="studyTime"
            stackId="2"
            stroke="#22c55e"
            fill="url(#studyTime)"
            name="studyTime"
          />
          <Area
            type="monotone"
            dataKey="blockedTime"
            stackId="3"
            stroke="#f59e0b"
            fill="url(#blockedTime)"
            name="blockedTime"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}