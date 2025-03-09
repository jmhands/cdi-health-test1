'use client';

import { Card, Table } from 'flowbite-react';
import { ParsedDriveData } from '@/lib/smartctl-service';

interface DriveAnalyticsProps {
  drives: ParsedDriveData[];
}

export function DriveAnalytics({ drives }: DriveAnalyticsProps) {
  // Group drives by vendor
  const vendorGroups = drives.reduce((acc, drive) => {
    const vendor = drive.vendor || 'Unknown';
    if (!acc[vendor]) acc[vendor] = [];
    acc[vendor].push(drive);
    return acc;
  }, {} as Record<string, ParsedDriveData[]>);

  // Calculate age groups
  const ageGroups = drives.reduce((acc, drive) => {
    const hours = drive.powerOnHours;
    let group = '< 6 months';
    if (hours > 43800) group = '> 5 years';
    else if (hours > 35040) group = '4-5 years';
    else if (hours > 26280) group = '3-4 years';
    else if (hours > 17520) group = '2-3 years';
    else if (hours > 8760) group = '1-2 years';
    else if (hours > 4380) group = '6-12 months';
    
    if (!acc[group]) acc[group] = 0;
    acc[group]++;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Vendor Distribution */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Vendor Distribution
          </h5>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Vendor</Table.HeadCell>
            <Table.HeadCell>Drive Count</Table.HeadCell>
            <Table.HeadCell>Healthy</Table.HeadCell>
            <Table.HeadCell>Warning</Table.HeadCell>
            <Table.HeadCell>Critical</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Object.entries(vendorGroups).map(([vendor, drives]) => {
              const healthy = drives.filter(d => d.health === 'healthy').length;
              const warning = drives.filter(d => d.health === 'warning').length;
              const critical = drives.filter(d => d.health === 'critical').length;
              
              return (
                <Table.Row key={vendor} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {vendor}
                  </Table.Cell>
                  <Table.Cell>{drives.length}</Table.Cell>
                  <Table.Cell className="text-green-500">{healthy}</Table.Cell>
                  <Table.Cell className="text-yellow-500">{warning}</Table.Cell>
                  <Table.Cell className="text-red-500">{critical}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Card>

      {/* Age Distribution */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Age Distribution
          </h5>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Age Range</Table.HeadCell>
            <Table.HeadCell>Drive Count</Table.HeadCell>
            <Table.HeadCell>Percentage</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {Object.entries(ageGroups).map(([range, count]) => (
              <Table.Row key={range} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {range}
                </Table.Cell>
                <Table.Cell>{count}</Table.Cell>
                <Table.Cell>
                  {Math.round((count / drives.length) * 100)}%
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
} 