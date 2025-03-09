import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = '/tmp/cdi/logs';

export async function GET() {
  try {
    // Read all JSON files from log directory
    const files = await fs.readdir(LOG_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    // Read and parse each file
    const drives = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(LOG_DIR, file), 'utf-8');
        return JSON.parse(content);
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

