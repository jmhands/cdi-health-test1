"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

// Mock self-test history data
const selfTestHistory = [
  {
    id: 1,
    type: "Short",
    status: "Completed without error",
    lifetime: 4380,
    date: "2023-12-15T14:30:00Z",
    result: "pass",
  },
  {
    id: 2,
    type: "Extended",
    status: "Completed without error",
    lifetime: 4350,
    date: "2023-12-10T08:15:00Z",
    result: "pass",
  },
  {
    id: 3,
    type: "Short",
    status: "Completed without error",
    lifetime: 4320,
    date: "2023-12-05T10:45:00Z",
    result: "pass",
  },
  {
    id: 4,
    type: "Short",
    status: "Interrupted (host reset)",
    lifetime: 4290,
    date: "2023-11-30T16:20:00Z",
    result: "warning",
  },
  {
    id: 5,
    type: "Extended",
    status: "Completed without error",
    lifetime: 4260,
    date: "2023-11-25T09:10:00Z",
    result: "pass",
  },
]

export function SelfTestHistory() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">#</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Lifetime (hours)</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Result</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selfTestHistory.map((test) => (
            <TableRow key={test.id}>
              <TableCell className="font-medium">{test.id}</TableCell>
              <TableCell>{test.type}</TableCell>
              <TableCell>{test.status}</TableCell>
              <TableCell>{test.lifetime}</TableCell>
              <TableCell>
                {new Date(test.date).toLocaleDateString()} {new Date(test.date).toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {test.result === "pass" && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" /> Pass
                  </Badge>
                )}
                {test.result === "warning" && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <AlertTriangle className="mr-1 h-3 w-3" /> Warning
                  </Badge>
                )}
                {test.result === "fail" && (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <XCircle className="mr-1 h-3 w-3" /> Fail
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

