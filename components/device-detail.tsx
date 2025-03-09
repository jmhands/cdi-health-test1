export function DeviceDetail({ device }: { device: ParsedDriveData }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{device.model}</h2>
        <Badge variant={device.health === "healthy" ? "success" : "destructive"}>
          {device.health}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          title="Device Info"
          items={[
            { label: "Serial Number", value: device.serialNumber },
            { label: "Vendor", value: device.vendor },
            { label: "Type", value: device.type },
            { label: "Firmware", value: device.firmware },
            { label: "Capacity", value: device.capacity },
            { label: "CDI Grade", value: device.grade },
          ]}
        />

        <InfoCard
          title="Health Metrics"
          items={[
            { label: "Temperature", value: `${device.temperature}°C` },
            { label: "Power On Hours", value: device.powerOnHours.toString() },
            { label: "Media Errors", value: device.mediaErrors.toString() },
            { label: "Reallocated Sectors", value: device.reallocatedSectors.toString() },
          ]}
        />
      </div>

      {device.flags.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Warnings</h3>
          <div className="flex flex-wrap gap-2">
            {device.flags.map((flag, i) => (
              <Badge key={i} variant="warning">{flag}</Badge>
            ))}
          </div>
        </div>
      )}

      <SmartAttributesTable
        deviceType={device.type}
        smartAttributes={device.smartAttributes}
      />
    </div>
  );
} 