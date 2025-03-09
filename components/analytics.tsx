"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthTrendChart } from "./charts/health-trend-chart"
import { TemperatureDistributionChart } from "./charts/temperature-distribution-chart"
import { VendorDistributionChart } from "./charts/vendor-distribution-chart"
import { AgeDistributionChart } from "./charts/age-distribution-chart"
import { DonutChart } from "./charts/donut-chart"
import { BarChart } from "./charts/bar-chart"

export function Analytics() {
  return (
    <div className="grid gap-4">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Analyze trends and patterns across your storage device population</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="health" className="space-y-4">
            <TabsList>
              <TabsTrigger value="health">Health Trends</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="vendors">Vendors</TabsTrigger>
              <TabsTrigger value="age">Age Distribution</TabsTrigger>
            </TabsList>
            <TabsContent value="health" className="space-y-4">
              <HealthTrendChart />
            </TabsContent>
            <TabsContent value="temperature" className="space-y-4">
              <TemperatureDistributionChart />
            </TabsContent>
            <TabsContent value="vendors" className="space-y-4">
              <VendorDistributionChart />
            </TabsContent>
            <TabsContent value="age" className="space-y-4">
              <AgeDistributionChart />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export function DriveAnalytics({ drives }: { drives: ParsedDriveData[] }) {
  // Calculate real statistics
  const totalDrives = drives.length;
  const healthyDrives = drives.filter(d => d.health === "healthy").length;
  const criticalDrives = drives.filter(d => d.health === "critical").length;
  
  const gradeDistribution = drives.reduce((acc, drive) => {
    acc[drive.grade] = (acc[drive.grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageTemp = drives.reduce((sum, drive) => sum + drive.temperature, 0) / totalDrives;
  
  const totalErrors = drives.reduce((sum, drive) => sum + drive.mediaErrors, 0);

  // Use these real values in your charts
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Drive Health</CardTitle>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={[
              { name: "Healthy", value: healthyDrives },
              { name: "Critical", value: criticalDrives }
            ]}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>CDI Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={Object.entries(gradeDistribution).map(([grade, count]) => ({
              name: grade,
              value: count
            }))}
          />
        </CardContent>
      </Card>

      {/* Add more real analytics as needed */}
    </div>
  );
}

