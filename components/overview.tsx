"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive, AlertTriangle, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { HealthDistributionChart } from "./charts/health-distribution-chart"
import { DeviceTypeDistributionChart } from "./charts/device-type-distribution-chart"
import { RecentActivityList } from "./recent-activity-list"
import { Button } from "@/components/ui/button"
import { getAllDrives, type ParsedDriveData } from "@/lib/smartctl-service"

export function Overview() {
  const [devices, setDevices] = useState<ParsedDriveData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    healthy: 0,
    warning: 0,
    critical: 0,
  })

  const fetchDevices = async () => {
    setLoading(true)
    setError(null)
    try {
      const drives = await getAllDrives()
      setDevices(drives)

      // Calculate stats
      const healthy = drives.filter((d) => d.health === "healthy").length
      const warning = drives.filter((d) => d.health === "warning").length
      const critical = drives.filter((d) => d.health === "critical").length

      setStats({
        total: drives.length,
        healthy,
        warning,
        critical,
      })
    } catch (err) {
      console.error("Failed to fetch drives:", err)
      setError("Failed to fetch drive data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {loading ? (
              <span className="flex items-center">
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> Loading...
              </span>
            ) : (
              `${stats.total} devices detected`
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Healthy Devices</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.healthy}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0
              ? `${Math.round((stats.healthy / stats.total) * 100)}% of total devices`
              : "No devices detected"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Warning Devices</CardTitle>
          <AlertTriangle className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.warning}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0
              ? `${Math.round((stats.warning / stats.total) * 100)}% of total devices`
              : "No devices detected"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Critical Devices</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.critical}</div>
          <p className="text-xs text-muted-foreground">
            {stats.total > 0
              ? `${Math.round((stats.critical / stats.total) * 100)}% of total devices`
              : "No devices detected"}
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Health Distribution</CardTitle>
            <CardDescription>Overview of device health status distribution</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchDevices} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="pl-2">
          <HealthDistributionChart devices={devices} />
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Device Type Distribution</CardTitle>
          <CardDescription>Breakdown of devices by type</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <DeviceTypeDistributionChart devices={devices} />
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest device scans and status changes</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivityList devices={devices} />
        </CardContent>
      </Card>
    </div>
  )
}

