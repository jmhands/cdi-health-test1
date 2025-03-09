"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, HardDrive, Home, Settings, AlertTriangle, CheckCircle, Database, Server } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">CDI Health Grading</h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <HardDrive className="mr-2 h-4 w-4" />
              All Devices
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <CheckCircle className="mr-2 h-4 w-4" />
              Healthy Devices
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Warning Devices
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Device Types</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <HardDrive className="mr-2 h-4 w-4" />
              HDD
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Database className="mr-2 h-4 w-4" />
              SSD
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Server className="mr-2 h-4 w-4" />
              NVMe
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Settings</h2>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}

