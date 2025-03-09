"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface SmartAttribute {
  id: number
  name: string
  value: number
  raw: string
  status: "good" | "warning" | "critical"
}

interface SmartAttributesTableProps {
  deviceType: string
  smartAttributes?: SmartAttribute[]
}

export function SmartAttributesTable({ deviceType, smartAttributes }: SmartAttributesTableProps) {
  // Default attributes for NVMe if no real data is available
  const defaultNvmeAttributes = [
    { id: 1, name: "Critical Warning", value: 0, raw: "No warnings", status: "good" as const },
    { id: 2, name: "Composite Temperature", value: 45, raw: "45°C", status: "good" as const },
    { id: 3, name: "Available Spare", value: 98, raw: "98%", status: "good" as const },
    { id: 4, name: "Available Spare Threshold", value: 10, raw: "10%", status: "good" as const },
    { id: 5, name: "Percentage Used", value: 12, raw: "12%", status: "good" as const },
    { id: 6, name: "Data Units Read", value: 100, raw: "24.5 TB", status: "good" as const },
    { id: 7, name: "Data Units Written", value: 100, raw: "18.2 TB", status: "good" as const },
    { id: 8, name: "Host Read Commands", value: 100, raw: "1,234,567", status: "good" as const },
    { id: 9, name: "Host Write Commands", value: 100, raw: "987,654", status: "good" as const },
    { id: 10, name: "Controller Busy Time", value: 100, raw: "123 minutes", status: "good" as const },
    { id: 11, name: "Power Cycles", value: 100, raw: "42", status: "good" as const },
    { id: 12, name: "Power On Hours", value: 100, raw: "4,380 hours", status: "good" as const },
    { id: 13, name: "Unsafe Shutdowns", value: 100, raw: "2", status: "good" as const },
    { id: 14, name: "Media and Data Integrity Errors", value: 100, raw: "0", status: "good" as const },
    { id: 15, name: "Error Information Log Entries", value: 100, raw: "0", status: "good" as const },
  ]

  // Default attributes for SSD if no real data is available
  const defaultSsdAttributes = [
    { id: 1, name: "Raw Read Error Rate", value: 100, raw: "0", status: "good" as const },
    { id: 5, name: "Reallocated Sectors Count", value: 100, raw: "0", status: "good" as const },
    { id: 9, name: "Power-On Hours", value: 99, raw: "8760", status: "good" as const },
    { id: 12, name: "Power Cycle Count", value: 100, raw: "42", status: "good" as const },
    { id: 171, name: "Program Fail Count", value: 100, raw: "0", status: "good" as const },
    { id: 172, name: "Erase Fail Count", value: 100, raw: "0", status: "good" as const },
    { id: 173, name: "Wear Leveling Count", value: 95, raw: "32", status: "good" as const },
    { id: 174, name: "Unexpected Power Loss", value: 100, raw: "2", status: "good" as const },
    { id: 177, name: "Wear Range Delta", value: 100, raw: "2", status: "good" as const },
    { id: 181, name: "Program Fail Count", value: 100, raw: "0", status: "good" as const },
    { id: 182, name: "Erase Fail Count", value: 100, raw: "0", status: "good" as const },
    { id: 187, name: "Reported Uncorrectable Errors", value: 100, raw: "0", status: "good" as const },
    { id: 194, name: "Temperature", value: 68, raw: "32°C", status: "good" as const },
    { id: 195, name: "ECC On-the-Fly Error Count", value: 100, raw: "0", status: "good" as const },
    { id: 196, name: "Reallocation Event Count", value: 100, raw: "0", status: "good" as const },
    { id: 197, name: "Current Pending Sector Count", value: 100, raw: "0", status: "good" as const },
    { id: 198, name: "Offline Uncorrectable Sector Count", value: 100, raw: "0", status: "good" as const },
    { id: 199, name: "UDMA CRC Error Count", value: 100, raw: "0", status: "good" as const },
    { id: 232, name: "Available Reserved Space", value: 100, raw: "100%", status: "good" as const },
    { id: 233, name: "Media Wearout Indicator", value: 88, raw: "88%", status: "good" as const },
  ]

  // Default attributes for HDD if no real data is available
  const defaultHddAttributes = [
    { id: 1, name: "Raw Read Error Rate", value: 100, raw: "0", status: "good" as const },
    { id: 3, name: "Spin Up Time", value: 95, raw: "0 ms", status: "good" as const },
    { id: 4, name: "Start/Stop Count", value: 100, raw: "42", status: "good" as const },
    { id: 5, name: "Reallocated Sectors Count", value: 100, raw: "0", status: "good" as const },
    { id: 7, name: "Seek Error Rate", value: 100, raw: "0", status: "good" as const },
    { id: 9, name: "Power-On Hours", value: 95, raw: "26280", status: "good" as const },
    { id: 10, name: "Spin Retry Count", value: 100, raw: "0", status: "good" as const },
    { id: 12, name: "Power Cycle Count", value: 100, raw: "42", status: "good" as const },
    { id: 183, name: "SATA Downshift Error Count", value: 100, raw: "0", status: "good" as const },
    { id: 184, name: "End-to-End Error", value: 100, raw: "0", status: "good" as const },
    { id: 187, name: "Reported Uncorrectable Errors", value: 100, raw: "0", status: "good" as const },
    { id: 188, name: "Command Timeout", value: 100, raw: "0", status: "good" as const },
    { id: 189, name: "High Fly Writes", value: 100, raw: "0", status: "good" as const },
    { id: 190, name: "Airflow Temperature", value: 62, raw: "38°C", status: "good" as const },
    { id: 191, name: "G-Sense Error Rate", value: 100, raw: "0", status: "good" as const },
    { id: 192, name: "Power-Off Retract Count", value: 100, raw: "15", status: "good" as const },
    { id: 193, name: "Load Cycle Count", value: 100, raw: "142", status: "good" as const },
    { id: 194, name: "Temperature", value: 62, raw: "38°C", status: "good" as const },
    { id: 197, name: "Current Pending Sector Count", value: 100, raw: "0", status: "good" as const },
    { id: 198, name: "Offline Uncorrectable Sector Count", value: 100, raw: "0", status: "good" as const },
    { id: 199, name: "UDMA CRC Error Count", value: 200, raw: "0", status: "good" as const },
    { id: 200, name: "Multi-Zone Error Rate", value: 100, raw: "0", status: "good" as const },
  ]

  // Use real data if available, otherwise use default data based on device type
  const attributes =
    smartAttributes ||
    (deviceType === "NVME" ? defaultNvmeAttributes : deviceType === "SSD" ? defaultSsdAttributes : defaultHddAttributes)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Attribute Name</TableHead>
            <TableHead className="w-[100px]">Value</TableHead>
            <TableHead className="w-[180px]">Status</TableHead>
            <TableHead>Raw Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attributes.map((attribute) => (
            <TableRow key={attribute.id}>
              <TableCell className="font-medium">{attribute.id}</TableCell>
              <TableCell>{attribute.name}</TableCell>
              <TableCell>{attribute.value}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress
                    value={Number.parseInt(attribute.value.toString())}
                    className={cn(
                      "h-2",
                      attribute.status === "critical" 
                        ? "bg-red-500" 
                        : attribute.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                  />
                  <span className="text-xs">
                    {attribute.status === "critical" ? "Critical" : attribute.status === "warning" ? "Warning" : "Good"}
                  </span>
                </div>
              </TableCell>
              <TableCell>{attribute.raw}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

