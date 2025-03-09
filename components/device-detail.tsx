'use client';

import { Card, Badge, Progress, Table } from 'flowbite-react';
import { ParsedDriveData } from '@/lib/smartctl-service';

interface DeviceDetailProps {
  device: ParsedDriveData;
}

export function DeviceDetail({ device }: DeviceDetailProps) {
  const healthColor = 
    device.health === 'healthy' ? 'success' :
    device.health === 'warning' ? 'warning' : 'failure';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {device.model}
        </h2>
        <Badge color={healthColor} size="lg">
          {device.health}
        </Badge>
      </div>

      {/* Device Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h5 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Device Information
          </h5>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Serial Number</span>
                  <span className="text-sm text-gray-900">{device.serialNumber}</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Vendor</span>
                  <span className="text-sm text-gray-900">{device.vendor}</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Type</span>
                  <span className="text-sm text-gray-900">{device.type}</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Firmware</span>
                  <span className="text-sm text-gray-900">{device.firmware}</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Capacity</span>
                  <span className="text-sm text-gray-900">{device.capacity}</span>
                </div>
              </li>
            </ul>
          </div>
        </Card>

        <Card>
          <h5 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Health Metrics
          </h5>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Temperature</span>
                  <span className="text-sm text-gray-900">{device.temperature}°C</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Power On Hours</span>
                  <span className="text-sm text-gray-900">{device.powerOnHours}</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Media Errors</span>
                  <span className="text-sm text-gray-900">{device.mediaErrors}</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Reallocated Sectors</span>
                  <span className="text-sm text-gray-900">{device.reallocatedSectors}</span>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      {/* SMART Attributes */}
      {device.smartAttributes && device.smartAttributes.length > 0 && (
        <Card>
          <h5 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            SMART Attributes
          </h5>
          <Table>
            <Table.Head>
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Value</Table.HeadCell>
              <Table.HeadCell>Raw</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {device.smartAttributes.map((attr) => (
                <Table.Row key={attr.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{attr.id}</Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {attr.name}
                  </Table.Cell>
                  <Table.Cell>{attr.value}</Table.Cell>
                  <Table.Cell>{attr.raw}</Table.Cell>
                  <Table.Cell>
                    <Badge color={
                      attr.status === 'good' ? 'success' :
                      attr.status === 'warning' ? 'warning' : 'failure'
                    }>
                      {attr.status}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      )}
    </div>
  );
} 