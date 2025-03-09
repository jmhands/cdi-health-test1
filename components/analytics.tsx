"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthTrendChart } from "./charts/health-trend-chart"
import { TemperatureDistributionChart } from "./charts/temperature-distribution-chart"
import { VendorDistributionChart } from "./charts/vendor-distribution-chart"
import { AgeDistributionChart } from "./charts/age-distribution-chart"

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

