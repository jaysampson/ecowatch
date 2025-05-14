import type { TimeSeriesDataPoint, Device, EnergyMixDataPoint, DashboardData } from "@/types";
import { format, subHours, subMinutes, addMinutes } from 'date-fns';

const MOCK_DEVICE_NAMES = {
  "Solar Panel": ["AlphaSun XT3000", "EcoShine G5", "SunPower Max 500", "LG NeON R"],
  "Battery": ["PowerWall X", "StoreEdge Pro", "EnerVault Home", "Tesla Megapack Mini"],
  "Inverter": ["SunnyBoy 5.0", "Fronius Primo Gen24", "SolarEdge HD-Wave", "SMA Core1"]
};

const MOCK_SOLAR_LOCATIONS = ["Rooftop Array 1", "Ground Mount South", "Carport Solar System", "Community Solar Farm Section A"];

let deviceIdCounter = 0;

export function generateTimeSeriesData(points: number = 12, hoursAgo: number = 6, baseValue: number = 50, variation: number = 20): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = [];
  const now = new Date();
  for (let i = points -1; i >= 0; i--) {
    const timestamp = subHours(now, Math.floor(i * hoursAgo / points));
    data.push({
      timestamp: format(timestamp, "HH:mm"),
      value: parseFloat((baseValue + (Math.random() - 0.5) * variation).toFixed(2)),
    });
  }
  return data;
}

export function updateTimeSeriesData(existingData: TimeSeriesDataPoint[], baseValue: number = 50, variation: number = 10): TimeSeriesDataPoint[] {
  const newDataPoint: TimeSeriesDataPoint = {
    timestamp: format(new Date(), "HH:mm"),
    value: parseFloat((baseValue + (Math.random() - 0.5) * variation).toFixed(2)),
  };
  const updatedData = [...existingData.slice(1), newDataPoint];
  return updatedData;
}


export function generateDevices(count: number = 5): Device[] {
  const devices: Device[] = [];
  const types: Device["type"][] = ["Solar Panel", "Battery", "Inverter"];
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    const statusOptions: Device["status"][] = ["Online", "Offline", "Warning"];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    let namePool = MOCK_DEVICE_NAMES[type];
    let name = namePool[Math.floor(Math.random() * namePool.length)];
    if (type === "Solar Panel") {
        name = `${MOCK_SOLAR_LOCATIONS[i % MOCK_SOLAR_LOCATIONS.length]} - ${name}`;
    }


    const device: Device = {
      id: `device-${deviceIdCounter++}`,
      name: `${name} #${(i % 3) + 1}`,
      type,
      status,
      health: status === "Warning" ? Math.floor(Math.random() * 30) + 50 : Math.floor(Math.random() * 10) + 90,
      temperature: parseFloat((20 + Math.random() * 15).toFixed(1)),
    };

    if (type === "Solar Panel") {
      device.power = status === "Online" ? parseFloat((Math.random() * 5 + 1).toFixed(2)) : 0; // kW
    } else if (type === "Battery") {
      device.capacity = [10, 13.5, 15][Math.floor(Math.random() * 3)]; // kWh
      device.chargeLevel = status === "Online" ? Math.floor(Math.random() * 80) + 20 : 0; // %
    } else if (type === "Inverter") {
      device.power = status === "Online" ? parseFloat((Math.random() * 8 + 2).toFixed(2)) : 0; // kW
    }
    devices.push(device);
  }
  return devices;
}

export function updateDeviceStatus(devices: Device[]): Device[] {
  return devices.map(device => {
    // Small chance to change status
    if (Math.random() < 0.05) {
      const statusOptions: Device["status"][] = ["Online", "Offline", "Warning"];
      device.status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    }
    if (device.status === "Online") {
      if (device.type === "Solar Panel") device.power = parseFloat((Math.max(0, (device.power || 2) + (Math.random()-0.5)*1)).toFixed(2));
      if (device.type === "Battery") device.chargeLevel = Math.min(100, Math.max(0, (device.chargeLevel || 50) + (Math.random()-0.45)*10));
      if (device.type === "Inverter") device.power = parseFloat((Math.max(0, (device.power || 5) + (Math.random()-0.5)*2)).toFixed(2));
      device.health = Math.min(100, (device.health || 90) + (Math.random() > 0.8 ? -1 : 0.1));
    } else {
      if (device.type === "Solar Panel") device.power = 0;
      if (device.type === "Inverter") device.power = 0;
    }
    device.temperature = parseFloat(( (device.temperature || 25) + (Math.random()-0.5)*1 ).toFixed(1));
    return device;
  });
}


export function generateEnergyMix(): EnergyMixDataPoint[] {
  return [
    { name: "Solar", value: Math.floor(Math.random() * 50) + 30, fill: "var(--color-chart-3)" },
    { name: "Wind", value: Math.floor(Math.random() * 30) + 10, fill: "var(--color-chart-2)" },
    { name: "Grid", value: Math.floor(Math.random() * 20) + 5, fill: "var(--color-chart-4)" },
    { name: "Battery", value: Math.floor(Math.random() * 15) + 5, fill: "var(--color-chart-5)" },
  ];
}

export function updateEnergyMix(mix: EnergyMixDataPoint[]): EnergyMixDataPoint[] {
    return mix.map(item => ({
        ...item,
        value: Math.max(5, parseFloat((item.value + (Math.random() - 0.5) * (item.value * 0.2)).toFixed(0)))
    }));
}

export function getInitialDashboardData(): DashboardData {
  const productionHistory = generateTimeSeriesData(12, 6, 75, 30);
  const consumptionHistory = generateTimeSeriesData(12, 6, 60, 25);
  return {
    currentProduction: parseFloat((productionHistory[productionHistory.length -1]?.value || 75).toFixed(1)),
    currentConsumption: parseFloat((consumptionHistory[consumptionHistory.length -1]?.value || 60).toFixed(1)),
    gridEfficiency: parseFloat((85 + Math.random() * 10).toFixed(1)),
    co2Savings: parseFloat((1200 + Math.random() * 500).toFixed(0)),
    energyProductionHistory: productionHistory,
    energyConsumptionHistory: consumptionHistory,
    energyMix: generateEnergyMix(),
    devices: generateDevices(8),
  };
}

export function simulateDashboardDataUpdate(currentData: DashboardData): DashboardData {
  const newProductionHistory = updateTimeSeriesData(currentData.energyProductionHistory, 75, 30);
  const newConsumptionHistory = updateTimeSeriesData(currentData.energyConsumptionHistory, 60, 25);
  return {
    ...currentData,
    currentProduction: parseFloat((newProductionHistory[newProductionHistory.length - 1]?.value || 75).toFixed(1)),
    currentConsumption: parseFloat((newConsumptionHistory[newConsumptionHistory.length -1]?.value || 60).toFixed(1)),
    gridEfficiency: parseFloat(Math.min(99, Math.max(80, currentData.gridEfficiency + (Math.random() - 0.5) * 0.5)).toFixed(1)),
    co2Savings: parseFloat((currentData.co2Savings + Math.random() * 10).toFixed(0)),
    energyProductionHistory: newProductionHistory,
    energyConsumptionHistory: newConsumptionHistory,
    energyMix: updateEnergyMix(currentData.energyMix),
    devices: updateDeviceStatus(currentData.devices),
  };
}
