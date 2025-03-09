"use client"

import { Card } from 'flowbite-react';
import { DriveAnalytics } from './drive-analytics';
import { ParsedDriveData } from '@/lib/smartctl-service';

interface AnalyticsProps {
  drives: ParsedDriveData[];
}

export function Analytics({ drives }: AnalyticsProps) {
  // Calculate summary statistics
  const totalDrives = drives.length;
  const healthyDrives = drives.filter(d => d.health === "healthy").length;
  const warningDrives = drives.filter(d => d.health === "warning").length;
  const criticalDrives = drives.filter(d => d.health === "critical").length;
  
  const avgTemp = Math.round(drives.reduce((sum, d) => sum + d.temperature, 0) / totalDrives);
  const totalErrors = drives.reduce((sum, d) => sum + d.mediaErrors, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="max-w-sm">
          <div className="flex flex-col items-center">
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Total Drives
            </h5>
            <span className="text-3xl font-bold text-gray-700 dark:text-gray-400">
              {totalDrives}
            </span>
          </div>
        </Card>

        <Card className="max-w-sm">
          <div className="flex flex-col items-center">
            <h5 className="mb-1 text-xl font-medium text-green-600">
              Healthy Drives
            </h5>
            <span className="text-3xl font-bold text-green-500">
              {healthyDrives}
            </span>
          </div>
        </Card>

        <Card className="max-w-sm">
          <div className="flex flex-col items-center">
            <h5 className="mb-1 text-xl font-medium text-yellow-600">
              Warning Drives
            </h5>
            <span className="text-3xl font-bold text-yellow-500">
              {warningDrives}
            </span>
          </div>
        </Card>

        <Card className="max-w-sm">
          <div className="flex flex-col items-center">
            <h5 className="mb-1 text-xl font-medium text-red-600">
              Critical Drives
            </h5>
            <span className="text-3xl font-bold text-red-500">
              {criticalDrives}
            </span>
          </div>
        </Card>
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Temperature Overview
            </h5>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      Average Temperature
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {avgTemp}°C
                  </div>
                </div>
              </li>
              <li className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      Total Media Errors
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    {totalErrors}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Health Distribution
            </h5>
          </div>
          <div className="flex items-center justify-center py-6">
            <div className="flex space-x-3">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-900">Healthy ({Math.round(healthyDrives/totalDrives*100)}%)</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-900">Warning ({Math.round(warningDrives/totalDrives*100)}%)</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm font-medium text-gray-900">Critical ({Math.round(criticalDrives/totalDrives*100)}%)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <DriveAnalytics drives={drives} />
    </div>
  );
}

