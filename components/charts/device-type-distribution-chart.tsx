"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import type { ParsedDriveData } from "@/lib/smartctl-service"

interface DeviceTypeDistributionChartProps {
  devices: ParsedDriveData[]
}

export function DeviceTypeDistributionChart({ devices }: DeviceTypeDistributionChartProps) {
  // Count devices by type
  const deviceCounts: Record<string, number> = {}
  devices.forEach((device) => {
    deviceCounts[device.type] = (deviceCounts[device.type] || 0) + 1
  })

  // Convert to array for chart
  const data = Object.entries(deviceCounts).map(([name, value]) => ({
    name,
    value,
    color: name === "HDD" ? "#3b82f6" : name === "SSD" ? "#8b5cf6" : "#ec4899",
  }))

  // If no devices, show empty state
  if (devices.length === 0) {
    return (
      <div className="flex justify-center items-center h-[350px] text-muted-foreground">No device data available</div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
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

