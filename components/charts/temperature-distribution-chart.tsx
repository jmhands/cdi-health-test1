"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

// Mock data for the temperature distribution chart
const data = [
  {
    range: "25-30°C",
    count: 120,
  },
  {
    range: "31-35°C",
    count: 350,
  },
  {
    range: "36-40°C",
    count: 480,
  },
  {
    range: "41-45°C",
    count: 220,
  },
  {
    range: "46-50°C",
    count: 60,
  },
  {
    range: "51-55°C",
    count: 18,
  },
]

export function TemperatureDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="range" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Device Count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

