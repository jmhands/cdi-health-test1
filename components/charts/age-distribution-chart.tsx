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
    <div className="p-4">
      <div className="text-center text-gray-500">
        Age distribution data will be implemented in a future update
      </div>
    </div>
  );
}

