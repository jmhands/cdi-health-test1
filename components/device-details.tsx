"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  FileText,
  Clock,
  Thermometer,
  Activity,
  RefreshCw,
} from "lucide-react"
import { SmartAttributesTable } from "./smart-attributes-table"
import { SelfTestHistory } from "./self-test-history"
import { getSmartctlData, type ParsedDriveData } from "@/lib/smartctl-service"

interface DeviceDetailsProps {
  deviceId: string
}

export function DeviceDetails({ deviceId }: DeviceDetailsProps) {
  const [device, setDevice] = useState<ParsedDriveData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeviceData = async () => {
    setLoading(true)
    setError(null)
    try {
      // In a real app, we would use the deviceId to determine the device path
      // For now, we'll use a hardcoded path based on the deviceId
      const devicePath = deviceId.includes("nvme") ? "/dev/nvme0n1" : "/dev/sda"
      const deviceData = await getSmartctlData(devicePath)
      if (deviceData) {
        setDevice(deviceData)
      } else {
        throw new Error("Failed to fetch device data")
      }
    } catch (error) {
      console.error("Failed to fetch device data:", error)
      setError("Failed to fetch device details. Please check console for more information.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeviceData()
  }, [deviceId])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            <p>Loading device details...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !device) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error || "Failed to load device details"}</p>
            <Button variant="outline" size="sm" onClick={fetchDeviceData} className="mt-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-7">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Device Information</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchDeviceData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{device.model}</h3>
              {device.health === "healthy" && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="mr-1 h-3 w-3" /> Healthy
                </Badge>
              )}
              {device.health === "warning" && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <AlertTriangle className="mr-1 h-3 w-3" /> Warning
                </Badge>
              )}
              {device.health === "critical" && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="mr-1 h-3 w-3" /> Critical
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Serial Number:</div>
                <div className="text-sm">{device.serialNumber}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Type:</div>
                <div className="text-sm">{device.type}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Vendor:</div>
                <div className="text-sm">{device.vendor}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Firmware:</div>
                <div className="text-sm">{device.firmware}</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm font-medium">Capacity:</div>
                <div className="text-sm">{device.capacity}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">Power On Hours:</div>
                <div className="text-sm">{device.powerOnHours.toLocaleString()} hours</div>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">Temperature:</div>
                <div
                  className={`text-sm ${device.temperature > 45 ? "text-red-600" : device.temperature > 40 ? "text-amber-600" : ""}`}
                >
                  {device.temperature}°C
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-medium">Media Errors:</div>
                <div className="text-sm">{device.mediaErrors}</div>
              </div>
            </div>

            <Separator />

            {device.type === "NVME" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Available Spare:</div>
                  <div className="text-sm">{device.availableSpare}%</div>
                </div>
                <Progress value={device.availableSpare} className="h-2" />

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm font-medium">Percentage Used:</div>
                  <div className="text-sm">{device.percentageUsed}%</div>
                </div>
                <Progress value={device.percentageUsed} className="h-2" />
              </div>
            )}

            {device.type !== "NVME" && device.reallocatedSectors !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Reallocated Sectors:</div>
                  <div className="text-sm">{device.reallocatedSectors}</div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-5">
        <CardHeader>
          <CardTitle>Device Details</CardTitle>
          <CardDescription>Detailed information and diagnostics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="smart" className="space-y-4">
            <TabsList>
              <TabsTrigger value="smart">SMART Attributes</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="selftest">Self-Test History</TabsTrigger>
              <TabsTrigger value="logs">Device Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="smart" className="space-y-4">
              <SmartAttributesTable deviceType={device.type} smartAttributes={device.smartAttributes} />
            </TabsContent>
            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Data Read</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{device.readBytes}</div>
                    <p className="text-xs text-muted-foreground">Total data read from host</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Data Written</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{device.writeBytes}</div>
                    <p className="text-xs text-muted-foreground">Total data written from host</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Temperature History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm">Maximum Temperature:</div>
                        <div className="text-sm font-medium">{device.maxTemperature || device.temperature}°C</div>
                      </div>
                      {device.warningTempTime !== undefined && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm">Warning Temp Time:</div>
                          <div className="text-sm font-medium">{device.warningTempTime} minutes</div>
                        </div>
                      )}
                      {device.criticalTempTime !== undefined && (
                        <div className="grid grid-cols-2 gap-1">
                          <div className="text-sm">Critical Temp Time:</div>
                          <div className="text-sm font-medium">{device.criticalTempTime} minutes</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Last Self-Test</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm">Status:</div>
                        <div className="text-sm font-medium">{device.selfTestStatus || "Unknown"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm">Date:</div>
                        <div className="text-sm font-medium">
                          {device.lastSelfTest ? new Date(device.lastSelfTest).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-sm">Time:</div>
                        <div className="text-sm font-medium">
                          {device.lastSelfTest ? new Date(device.lastSelfTest).toLocaleTimeString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="selftest" className="space-y-4">
              <SelfTestHistory />
            </TabsContent>
            <TabsContent value="logs" className="space-y-4">
              <div className="rounded-md border p-4">
                <pre className="text-xs overflow-auto max-h-[400px]">
                  {`NVMe Log Page 02h (SMART / Health Information) for device:
Device Critical Warnings:
  [0] = ${device.criticalWarning ? "1 (Warning)" : "0 (No warnings)"}

Temperature:
  Current: ${device.temperature}°C
  Warning Threshold: 80°C
  Critical Threshold: 85°C
  ${device.warningTempTime !== undefined ? `Warning Time: ${device.warningTempTime} minutes` : ""}
  ${device.criticalTempTime !== undefined ? `Critical Time: ${device.criticalTempTime} minutes` : ""}

${
  device.availableSpare !== undefined
    ? `Available Spare: ${device.availableSpare}%
Available Spare Threshold: 10%
Percentage Used: ${device.percentageUsed}%`
    : ""
}
Data Units Read: ${device.readBytes}
Data Units Written: ${device.writeBytes}
Power On Hours: ${device.powerOnHours}
Media and Data Integrity Errors: ${device.mediaErrors}

${device.type === "NVME" ? "NVMe Error Log:" : "Error Log:"}
No errors reported.`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

