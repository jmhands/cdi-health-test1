"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/overview"
import { DeviceTable } from "@/components/device-table"
import { DeviceDetails } from "@/components/device-details"
import { Analytics } from "@/components/analytics"
import { NavBar } from "@/components/nav-bar"
import { Button } from "@/components/ui/button"
import { Download, FileText, HardDrive, BarChart3 } from "lucide-react"

export default function Dashboard() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">CDI Health Grading Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center">
              <HardDrive className="mr-2 h-4 w-4" />
              Devices
            </TabsTrigger>
            {selectedDevice && (
              <TabsTrigger value="details" className="flex items-center">
                Device Details
              </TabsTrigger>
            )}
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Overview />
          </TabsContent>
          <TabsContent value="devices" className="space-y-4">
            <DeviceTable onSelectDevice={setSelectedDevice} />
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            {selectedDevice && <DeviceDetails deviceId={selectedDevice} />}
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Analytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

