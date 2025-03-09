import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { SmartctlData } from '@/lib/smartctl-service';

const LOG_DIR = '/tmp/cdi/logs';

export async function GET() {
  try {
    // Read all JSON files from log directory
    const files = await fs.readdir(LOG_DIR);
    const jsonFiles = files.filter((f: string) => f.endsWith('.json'));
    
    // Read and parse each file
    const drives = await Promise.all(
      jsonFiles.map(async (file: string) => {
        const content = await fs.readFile(path.join(LOG_DIR, file), 'utf-8');
        return JSON.parse(content) as SmartctlData;
      })
    );
    
    return NextResponse.json({
      success: true,
      drives,
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

