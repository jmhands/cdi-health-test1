"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

// Mock data for the health trend chart
const data = [
  {
    month: "Jan",
    healthy: 950,
    warning: 120,
    critical: 30,
  },
  {
    month: "Feb",
    healthy: 940,
    warning: 125,
    critical: 35,
  },
  {
    month: "Mar",
    healthy: 930,
    warning: 130,
    critical: 40,
  },
  {
    month: "Apr",
    healthy: 920,
    warning: 140,
    critical: 40,
  },
  {
    month: "May",
    healthy: 910,
    warning: 150,
    critical: 40,
  },
  {
    month: "Jun",
    healthy: 900,
    warning: 160,
    critical: 40,
  },
  {
    month: "Jul",
    healthy: 890,
    warning: 170,
    critical: 40,
  },
  {
    month: "Aug",
    healthy: 880,
    warning: 180,
    critical: 40,
  },
  {
    month: "Sep",
    healthy: 870,
    warning: 185,
    critical: 45,
  },
  {
    month: "Oct",
    healthy: 860,
    warning: 190,
    critical: 50,
  },
  {
    month: "Nov",
    healthy: 850,
    warning: 195,
    critical: 55,
  },
  {
    month: "Dec",
    healthy: 840,
    warning: 200,
    critical: 60,
  },
]

export function HealthTrendChart() {
  return (
    <div className="p-4">
      <div className="text-center text-gray-500">
        Health trend data will be implemented in a future update
      </div>
    </div>
  );
}

