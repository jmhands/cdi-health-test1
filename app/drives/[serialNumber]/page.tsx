'use client';

import { useEffect, useState } from 'react';
import { ParsedDriveData } from '@/lib/smartctl-service';
import { DeviceDetail } from '@/components/device-detail';

export default function DriveDetailPage({
  params
}: {
  params: { serialNumber: string }
}) {
  const [drive, setDrive] = useState<ParsedDriveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDrive() {
      try {
        const response = await fetch('/api/drives');
        if (!response.ok) {
          throw new Error('Failed to fetch drive data');
        }
        const data = await response.json();
        const matchingDrive = data.drives.find(
          (d: ParsedDriveData) => d.serialNumber === params.serialNumber
        );
        
        if (!matchingDrive) {
          throw new Error('Drive not found');
        }
        
        setDrive(matchingDrive);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load drive data');
      } finally {
        setLoading(false);
      }
    }

    fetchDrive();
  }, [params.serialNumber]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-gray-600">Loading drive details...</div>
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-red-600">{error || 'Drive not found'}</div>
      </div>
    );
  }

  return <DeviceDetail device={drive} />;
} 