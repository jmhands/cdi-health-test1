import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import fs from "fs"

const execAsync = promisify(exec)

export async function GET() {
  try {
    // Get list of block devices
    const { stdout: lsblkOutput } = await execAsync("lsblk -d -o NAME,TYPE,SIZE -J")
    const lsblkData = JSON.parse(lsblkOutput)

    // Filter for disk devices
    const diskDevices = lsblkData.blockdevices.filter((device: any) => device.type === "disk" || device.type === "nvme")

    console.log("Found devices:", diskDevices)

    // Get smartctl data for each device
    const drivesData = await Promise.all(
      diskDevices.map(async (device: any) => {
        try {
          const devicePath = `/dev/${device.name}`

          // Check if device exists
          if (!fs.existsSync(devicePath)) {
            console.error(`Device ${devicePath} does not exist`)
            return null
          }

          console.log(`Running smartctl on ${devicePath}`)
          const { stdout, stderr } = await execAsync(`smartctl -x ${devicePath} --json`)

          if (stderr) {
            console.error(`smartctl stderr for ${devicePath}:`, stderr)
          }

          return JSON.parse(stdout)
        } catch (error) {
          console.error(`Error getting smartctl data for /dev/${device.name}:`, error)
          return null
        }
      }),
    )

    // Filter out null values
    const validDrivesData = drivesData.filter((data) => data !== null)
    console.log(`Found ${validDrivesData.length} valid drives with SMART data`)

    return NextResponse.json(validDrivesData)
  } catch (error) {
    console.error("Error getting drives:", error)
    return NextResponse.json({ error: "Failed to get drives", details: String(error) }, { status: 500 })
  }
}

