'use client';

import { Table, Card, Badge } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { ParsedDriveData } from '@/lib/smartctl-service';
import Link from 'next/link';

export default function DrivesPage() {
  const [drives, setDrives] = useState<ParsedDriveData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDrives() {
      try {
        const response = await fetch('/api/drives');
        if (!response.ok) {
          throw new Error('Failed to fetch drives');
        }
        const data = await response.json();
        setDrives(data.drives);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drives');
      } finally {
        setLoading(false);
      }
    }

    fetchDrives();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-600">Loading drives...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Storage Devices
        </h1>
      </div>

      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>Model</Table.HeadCell>
            <Table.HeadCell>Serial Number</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Capacity</Table.HeadCell>
            <Table.HeadCell>Temperature</Table.HeadCell>
            <Table.HeadCell>Health</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {drives.map((drive) => (
              <Table.Row key={drive.serialNumber} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {drive.model}
                </Table.Cell>
                <Table.Cell>{drive.serialNumber}</Table.Cell>
                <Table.Cell>{drive.type}</Table.Cell>
                <Table.Cell>{drive.capacity}</Table.Cell>
                <Table.Cell>{drive.temperature}°C</Table.Cell>
                <Table.Cell>
                  <Badge color={
                    drive.health === 'healthy' ? 'success' :
                    drive.health === 'warning' ? 'warning' : 'failure'
                  }>
                    {drive.health}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    href={`/drives/${drive.serialNumber}`}
                    className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                  >
                    View Details
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
} 