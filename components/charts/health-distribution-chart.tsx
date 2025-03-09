"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import type { ParsedDriveData } from "@/lib/smartctl-service"

interface HealthDistributionChartProps {
  devices: ParsedDriveData[]
}

export function HealthDistributionChart({ devices }: HealthDistributionChartProps) {
  // Group devices by type and health status
  const deviceTypes = [...new Set(devices.map((device) => device.type))]

  const data = deviceTypes.map((type) => {
    const typeDevices = devices.filter((device) => device.type === type)
    const healthy = typeDevices.filter((device) => device.health === "healthy").length
    const warning = typeDevices.filter((device) => device.health === "warning").length
    const critical = typeDevices.filter((device) => device.health === "critical").length

    return {
      name: type,
      healthy,
      warning,
      critical,
    }
  })

  // If no devices, show empty state
  if (devices.length === 0) {
    return (
      <div className="flex justify-center items-center h-[350px] text-muted-foreground">No device data available</div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="healthy" name="Healthy" fill="#4ade80" radius={[4, 4, 0, 0]} />
        <Bar dataKey="warning" name="Warning" fill="#fbbf24" radius={[4, 4, 0, 0]} />
        <Bar dataKey="critical" name="Critical" fill="#f87171" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

