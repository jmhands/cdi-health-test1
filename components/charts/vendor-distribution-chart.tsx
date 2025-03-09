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
    <div className="p-4">
      <div className="text-center text-gray-500">
        Vendor distribution data will be implemented in a future update
      </div>
    </div>
  );
}

