"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, AlertTriangle, XCircle, HardDrive, Database, Server } from "lucide-react"
import type { ParsedDriveData } from "@/lib/smartctl-service"

interface RecentActivityListProps {
  devices: ParsedDriveData[]
}

export function RecentActivityList({ devices }: RecentActivityListProps) {
  // Generate mock activity based on real devices
  const recentActivity = devices.slice(0, 5).map((device, index) => ({
    id: index + 1,
    action: index % 2 === 0 ? "Device Scanned" : "Status Change",
    device: device.serialNumber,
    deviceType: device.type,
    status: device.health,
    previousStatus: device.health === "healthy" ? "warning" : "healthy",
    timestamp: new Date(Date.now() - index * 3600000).toISOString(), // Hours ago
    user: index % 2 === 0 ? "admin" : "system",
  }))

  // If no devices, show empty state
  if (devices.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px] text-muted-foreground">
        No recent activity available
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-start">
          <div className="mr-4">
            <Avatar>
              <AvatarImage src="" alt={activity.user} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {activity.user === "admin" ? "AD" : "SY"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.action}
              {activity.action === "Status Change" && (
                <span>
                  {" "}
                  from{" "}
                  <span
                    className={
                      activity.previousStatus === "healthy"
                        ? "text-green-600"
                        : activity.previousStatus === "warning"
                          ? "text-amber-600"
                          : "text-red-600"
                    }
                  >
                    {activity.previousStatus}
                  </span>{" "}
                  to{" "}
                  <span
                    className={
                      activity.status === "healthy"
                        ? "text-green-600"
                        : activity.status === "warning"
                          ? "text-amber-600"
                          : "text-red-600"
                    }
                  >
                    {activity.status}
                  </span>
                </span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                {activity.deviceType === "HDD" && <HardDrive className="h-3 w-3" />}
                {activity.deviceType === "SSD" && <Database className="h-3 w-3" />}
                {activity.deviceType === "NVME" && <Server className="h-3 w-3" />}
                {activity.device} ({activity.deviceType})
                {activity.status === "healthy" && <CheckCircle className="h-3 w-3 text-green-500" />}
                {activity.status === "warning" && <AlertTriangle className="h-3 w-3 text-amber-500" />}
                {activity.status === "critical" && <XCircle className="h-3 w-3 text-red-500" />}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

