export interface SmartctlDevice {
  name: string
  info_name: string
  type: string
  protocol: string
}

export interface NvmeSmartHealthInfo {
  critical_warning: number
  temperature: number
  available_spare: number
  available_spare_threshold: number
  percentage_used: number
  data_units_read: number
  data_units_written: number
  host_reads: number
  host_writes: number
  controller_busy_time: number
  power_cycles: number
  power_on_hours: number
  unsafe_shutdowns: number
  media_errors: number
  num_err_log_entries: number
  warning_temp_time: number
  critical_comp_time: number
  temperature_sensors?: number[]
}

export interface SmartctlData {
  device: SmartctlDevice
  model_name: string
  serial_number: string
  firmware_version: string
  nvme_total_capacity?: number
  user_capacity?: {
    blocks: number
    bytes: number
  }
  logical_block_size: number
  smart_status: {
    passed: boolean
    nvme?: {
      value: number
    }
  }
  nvme_smart_health_information_log?: NvmeSmartHealthInfo
  temperature?: {
    current: number
  }
  power_cycle_count: number
  power_on_time: {
    hours: number
  }
  ata_smart_attributes?: {
    table: Array<{
      id: number
      name: string
      value: number
      worst: number
      thresh: number
      raw_value: number
    }>
  }
}

export interface ParsedDriveData {
  id: string
  serialNumber: string
  model: string
  type: string
  vendor: string
  firmware: string
  capacity: string
  health: "healthy" | "warning" | "critical"
  temperature: number
  powerOnHours: number
  availableSpare?: number
  percentageUsed?: number
  mediaErrors: number
  criticalWarning: boolean
  readBytes: string
  writeBytes: string
  maxTemperature?: number
  warningTempTime?: number
  criticalTempTime?: number
  reallocatedSectors: number
  selfTestStatus?: string
  lastSelfTest?: string
  smartAttributes?: Array<{
    id: number
    name: string
    value: number
    raw: string
    status: "good" | "warning" | "critical"
  }>
}

// Function to convert bytes to human-readable format
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

// Function to extract vendor from model name
export function extractVendor(modelName: string): string {
  const commonVendors = [
    "Samsung",
    "Western",
    "WD",
    "Seagate",
    "Toshiba",
    "Hitachi",
    "Intel",
    "Crucial",
    "SanDisk",
    "Kingston",
    "Micron",
    "HGST",
    "Apple",
    "Corsair",
    "PNY",
    "OCZ",
    "Plextor",
    "ADATA",
  ]

  for (const vendor of commonVendors) {
    if (modelName.includes(vendor)) {
      return vendor === "Western" ? "Western Digital" : vendor
    }
  }

  // If no known vendor is found, use the first word
  const firstWord = modelName.split(" ")[0]
  return firstWord || "Unknown"
}

// Function to parse smartctl data into our app's format
export function parseSmartctlData(data: SmartctlData): ParsedDriveData {
  // Extract vendor from model name
  const vendor = extractVendor(data.model_name)

  // Determine drive type
  let type = data.device.type.toUpperCase()
  if (type === "SAT") type = "SATA"

  // Calculate health status
  let health: "healthy" | "warning" | "critical" = "healthy"

  if (!data.smart_status.passed) {
    health = "critical"
  } else if (data.nvme_smart_health_information_log) {
    const nvmeHealth = data.nvme_smart_health_information_log

    if (nvmeHealth.critical_warning > 0 || nvmeHealth.media_errors > 0) {
      health = "critical"
    } else if (nvmeHealth.percentage_used > 90 || nvmeHealth.available_spare < 20 || nvmeHealth.temperature > 70) {
      health = "warning"
    }
  } else if (data.ata_smart_attributes) {
    // Check for critical SMART attributes for HDD/SSD
    const criticalAttributes = data.ata_smart_attributes.table.filter(
      (attr) =>
        (attr.id === 5 && attr.raw_value > 0) || // Reallocated Sectors Count
        (attr.id === 187 && attr.raw_value > 0) || // Reported Uncorrectable Errors
        (attr.id === 197 && attr.raw_value > 0) || // Current Pending Sector Count
        (attr.id === 198 && attr.raw_value > 0), // Offline Uncorrectable Sector Count
    )

    if (criticalAttributes.length > 0) {
      health = "critical"
    }

    // Check for warning attributes
    const warningAttributes = data.ata_smart_attributes.table.filter(
      (attr) =>
        (attr.id === 1 && attr.value < 70) || // Raw Read Error Rate
        (attr.id === 7 && attr.value < 70) || // Seek Error Rate
        (attr.id === 10 && attr.raw_value > 0) || // Spin Retry Count
        (attr.id === 184 && attr.raw_value > 0) || // End-to-End Error
        (attr.id === 196 && attr.raw_value > 0), // Reallocation Event Count
    )

    if (health !== "critical" && warningAttributes.length > 0) {
      health = "warning"
    }
  }

  // Format capacity
  const capacityBytes = data.nvme_total_capacity || data.user_capacity?.bytes || 0
  const capacity = formatBytes(capacityBytes)

  // Format read/write bytes
  let readBytes = "0 B"
  let writeBytes = "0 B"
  let reallocatedSectors = 0

  if (data.nvme_smart_health_information_log) {
    // NVMe data units are 512KB each
    const readBytesValue = data.nvme_smart_health_information_log.data_units_read * 512 * 1000
    const writeBytesValue = data.nvme_smart_health_information_log.data_units_written * 512 * 1000

    readBytes = formatBytes(readBytesValue)
    writeBytes = formatBytes(writeBytesValue)
  } else if (data.ata_smart_attributes) {
    // Try to find read/write bytes in SMART attributes
    const totalLBARead = data.ata_smart_attributes.table.find((attr) => attr.id === 241)
    const totalLBAWritten = data.ata_smart_attributes.table.find((attr) => attr.id === 242)

    if (totalLBARead) {
      readBytes = formatBytes(totalLBARead.raw_value * 512)
    }

    if (totalLBAWritten) {
      writeBytes = formatBytes(totalLBAWritten.raw_value * 512)
    }

    // Get reallocated sectors
    const reallocatedSectorsAttr = data.ata_smart_attributes.table.find((attr) => attr.id === 5)
    if (reallocatedSectorsAttr) {
      reallocatedSectors = reallocatedSectorsAttr.raw_value
    }
  }

  // Parse SMART attributes for display
  const smartAttributes = data.ata_smart_attributes?.table.map((attr) => {
    let status: "good" | "warning" | "critical" = "good"

    // Determine status based on attribute values
    if (
      attr.value < attr.thresh ||
      (attr.id === 5 && attr.raw_value > 0) || // Reallocated Sectors
      (attr.id === 187 && attr.raw_value > 0) || // Reported Uncorrectable Errors
      (attr.id === 197 && attr.raw_value > 0) || // Current Pending Sectors
      (attr.id === 198 && attr.raw_value > 0)
    ) {
      // Offline Uncorrectable
      status = "critical"
    } else if (
      attr.value < attr.thresh + 20 ||
      (attr.id === 1 && attr.value < 70) || // Raw Read Error Rate
      (attr.id === 7 && attr.value < 70) || // Seek Error Rate
      (attr.id === 10 && attr.raw_value > 0)
    ) {
      // Spin Retry Count
      status = "warning"
    }

    return {
      id: attr.id,
      name: attr.name,
      value: attr.value,
      raw: attr.raw_value.toString(),
      status,
    }
  })

  return {
    id: data.serial_number,
    serialNumber: data.serial_number,
    model: data.model_name,
    type,
    vendor,
    firmware: data.firmware_version,
    capacity,
    health,
    temperature: data.temperature?.current || data.nvme_smart_health_information_log?.temperature || 0,
    powerOnHours: data.power_on_time.hours,
    availableSpare: data.nvme_smart_health_information_log?.available_spare,
    percentageUsed: data.nvme_smart_health_information_log?.percentage_used,
    mediaErrors: data.nvme_smart_health_information_log?.media_errors || 0,
    criticalWarning: (data.nvme_smart_health_information_log?.critical_warning || 0) !== 0,
    readBytes,
    writeBytes,
    warningTempTime: data.nvme_smart_health_information_log?.warning_temp_time,
    criticalTempTime: data.nvme_smart_health_information_log?.critical_comp_time,
    reallocatedSectors,
    smartAttributes,
  }
}

// Function to execute smartctl command and get data
export async function getSmartctlData(devicePath: string): Promise<ParsedDriveData | null> {
  try {
    const response = await fetch(`/api/smartctl?device=${encodeURIComponent(devicePath)}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch smartctl data: ${response.statusText}`)
    }

    const data: SmartctlData = await response.json()
    return parseSmartctlData(data)
  } catch (error) {
    console.error("Error fetching smartctl data:", error)
    return null
  }
}

interface SmartctlResponse {
  success: boolean;
  drives: Array<SmartctlData>;
  timestamp: string;
}

export async function getAllDrives(): Promise<ParsedDriveData[]> {
  try {
    const response = await fetch('/api/drives');
    if (!response.ok) {
      throw new Error(`Failed to fetch drives: ${response.statusText}`);
    }
    const data = await response.json();
    return data.drives.map(parseDeviceData);
  } catch (error) {
    console.error('Error fetching drives:', error);
    throw error;
  }
}

// Update the interfaces to match CDI data structure
export interface CDIDevice {
  dut: string;  // device path
  serial_number: string;
  vendor: string;
  model_number: string;
  firmware_revision: string;
  transport_protocol: string;
  media_type: string;
  size: number;
  smart_status: boolean;
  cdi_grade: string;
  cdi_eligible: boolean;
  cdi_certified: boolean;
  state: string;
  flags: string[];
  power_on_hours: number;
  temperature: {
    current: number;
    maximum: number;
    minimum: number;
  };
  reallocated_sectors: number;
  pending_sectors: number;
  offline_uncorrectable_sectors: number;
  smart_attributes: Array<{
    id: number;
    name: string;
    value: number;
    worst: number;
    thresh: number;
    raw_value: number;
  }>;
}

export function parseDeviceData(data: CDIDevice) {
  return {
    id: data.serial_number,
    serialNumber: data.serial_number,
    model: data.model_number,
    type: data.transport_protocol,
    vendor: data.vendor,
    firmware: data.firmware_revision,
    capacity: `${data.size} GB`,
    health: data.smart_status ? "healthy" : "critical",
    temperature: data.temperature?.current || 0,
    powerOnHours: data.power_on_hours,
    mediaErrors: data.offline_uncorrectable_sectors,
    criticalWarning: !data.smart_status,
    grade: data.cdi_grade,
    flags: data.flags,
    reallocatedSectors: data.reallocated_sectors,
    smartAttributes: data.smart_attributes?.map(attr => ({
      id: attr.id,
      name: attr.name,
      value: attr.value,
      raw: attr.raw_value.toString(),
      status: attr.value < attr.thresh ? "critical" : 
              attr.value < attr.thresh + 20 ? "warning" : "good"
    }))
  };
}

