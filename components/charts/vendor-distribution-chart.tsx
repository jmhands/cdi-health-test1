"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Mock data for the vendor distribution chart
const data = [
  { name: "Western Digital", value: 420, color: "#3b82f6" },
  { name: "Seagate", value: 380, color: "#8b5cf6" },
  { name: "Samsung", value: 280, color: "#ec4899" },
  { name: "Intel", value: 120, color: "#10b981" },
  { name: "Crucial", value: 48, color: "#f59e0b" },
]

export function VendorDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} devices`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

