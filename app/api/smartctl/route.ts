import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"

const execAsync = promisify(exec)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const device = searchParams.get("device")

  if (!device) {
    return NextResponse.json({ error: "Device parameter is required" }, { status: 400 })
  }

  // Validate device path to prevent command injection
  if (!/^\/dev\/(sd[a-z]|nvme[0-9]+n[0-9]+)$/.test(device)) {
    return NextResponse.json({ error: "Invalid device path" }, { status: 400 })
  }

  // Check if device exists
  if (!fs.existsSync(device)) {
    return NextResponse.json({ error: `Device ${device} does not exist` }, { status: 404 })
  }

  try {
    console.log(`Running smartctl on ${device}`)
    // Execute smartctl command
    const { stdout, stderr } = await execAsync(`smartctl -x ${device} --json`)

    if (stderr) {
      console.error("smartctl stderr:", stderr)
    }

    // Parse the JSON output
    const data = JSON.parse(stdout)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error executing smartctl:", error)
    return NextResponse.json(
      {
        error: "Failed to execute smartctl command",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

