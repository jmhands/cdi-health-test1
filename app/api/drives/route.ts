import { exec } from 'child_process';
import { NextResponse } from 'next/server';
import path from 'path';

async function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error && !stdout) {  // We still want the JSON output even if smartctl returns error codes
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

export async function GET() {
  try {
    const scriptPath = path.join(process.cwd(), 'scripts', 'scan-drives.sh');
    const result = await executeCommand(`sudo ${scriptPath}`);
    
    // Parse the JSON output
    const data = JSON.parse(result);
    
    // Filter for valid SMART data
    const validDrives = data.devices.filter(device => {
      const smartData = device.data;
      return smartData && !smartData.smartctl.messages?.some(
        (msg: { severity: string }) => msg.severity === 'error'
      );
    });

    return NextResponse.json({
      success: true,
      allDevices: data.devices,
      validDrives: validDrives,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scan drives',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

