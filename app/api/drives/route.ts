import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const LOG_DIR = '/tmp/cdi/logs';

interface SmartData {
  device_path: string;
  timestamp: string;
  serial_number: string;
  model_name: string;
  vendor: string;
  cdi_grade: string;
  smart_status: {
    passed: boolean;
  };
  // ... other fields from smartctl
}

export async function GET() {
  try {
    // Read all JSON files from log directory
    const files = await fs.readdir(LOG_DIR);
    const jsonFiles = files.filter((f: string) => f.endsWith('.json'));
    
    // Read and parse each file
    const drives = await Promise.all(
      jsonFiles.map(async (file: string) => {
        const content = await fs.readFile(path.join(LOG_DIR, file), 'utf-8');
        return JSON.parse(content) as SmartData;
      })
    );
    
    return NextResponse.json({
      success: true,
      drives: drives.map(drive => ({
        ...drive,
        health: drive.smart_status?.passed ? 'healthy' : 'critical',
        grade: drive.cdi_grade || 'U'
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error reading drive data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read drive data' },
      { status: 500 }
    );
  }
}

