"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

// Mock data for the age distribution chart
const data = [
  {
    range: "< 6 months",
    count: 180,
  },
  {
    range: "6-12 months",
    count: 240,
  },
  {
    range: "1-2 years",
    count: 320,
  },
  {
    range: "2-3 years",
    count: 280,
  },
  {
    range: "3-4 years",
    count: 150,
  },
  {
    range: "> 4 years",
    count: 78,
  },
]

export function AgeDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="range" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Device Count" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

