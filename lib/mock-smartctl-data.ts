// This file provides mock data for testing on Mac where direct device access might be limited

import type { SmartctlData } from "./smartctl-service"

export const mockNvmeData: SmartctlData = {
  device: {
    name: "/dev/nvme1n1",
    info_name: "/dev/nvme1n1",
    type: "nvme",
    protocol: "NVMe",
  },
  model_name: "Samsung SSD 980 PRO 1TB",
  serial_number: "S5P2NG0R501653Z",
  firmware_version: "5B2QGXA7",
  nvme_total_capacity: 1000204886016,
  logical_block_size: 512,
  smart_status: {
    passed: true,
    nvme: {
      value: 0,
    },
  },
  nvme_smart_health_information_log: {
    critical_warning: 0,
    temperature: 28,
    available_spare: 100,
    available_spare_threshold: 10,
    percentage_used: 10,
    data_units_read: 29142886,
    data_units_written: 72833264,
    host_reads: 362102136,
    host_writes: 963945078,
    controller_busy_time: 5761,
    power_cycles: 123,
    power_on_hours: 2713,
    unsafe_shutdowns: 58,
    media_errors: 0,
    num_err_log_entries: 0,
    warning_temp_time: 0,
    critical_comp_time: 0,
    temperature_sensors: [28, 34],
  },
  temperature: {
    current: 28,
  },
  power_cycle_count: 123,
  power_on_time: {
    hours: 2713,
  },
}

export const mockSsdData: SmartctlData = {
  device: {
    name: "/dev/disk0",
    info_name: "/dev/disk0",
    type: "ssd",
    protocol: "SATA",
  },
  model_name: "APPLE SSD AP1024N",
  serial_number: "C02XL0JGMD6T",
  firmware_version: "873.100.0",
  user_capacity: {
    blocks: 1953525168,
    bytes: 1000204886016,
  },
  logical_block_size: 512,
  smart_status: {
    passed: true,
  },
  temperature: {
    current: 35,
  },
  power_cycle_count: 245,
  power_on_time: {
    hours: 5432,
  },
}

export const mockHddData: SmartctlData = {
  device: {
    name: "/dev/disk1",
    info_name: "/dev/disk1",
    type: "hdd",
    protocol: "SATA",
  },
  model_name: "WD Red Pro 8TB",
  serial_number: "WD-WCC6Y5RL9AAA",
  firmware_version: "81.00A81",
  user_capacity: {
    blocks: 15628053168,
    bytes: 8001563222016,
  },
  logical_block_size: 512,
  smart_status: {
    passed: true,
  },
  temperature: {
    current: 38,
  },
  power_cycle_count: 42,
  power_on_time: {
    hours: 26280,
  },
}

// Array of mock devices for testing
export const mockDevices: SmartctlData[] = [mockNvmeData, mockSsdData, mockHddData]

