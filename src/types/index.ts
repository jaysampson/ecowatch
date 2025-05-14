export interface TimeSeriesDataPoint {
  timestamp: string; // ISO string or formatted string for labels
  value: number;
}

export interface EnergyData {
  production: TimeSeriesDataPoint[];
  consumption: TimeSeriesDataPoint[];
}

export interface Device {
  id: string;
  name: string;
  type: "Inverter" | "Battery" | "Solar Panel";
  status: "Online" | "Offline" | "Warning";
  power?: number; // in kW for panels/inverters
  capacity?: number; // in kWh for batteries
  chargeLevel?: number; // percentage for batteries
  health?: number; // percentage
  temperature?: number; // Celsius
}

export interface EnergyMixDataPoint {
  name: string;
  value: number;
  fill: string; // CSS variable for color
}

export interface DashboardData {
  currentProduction: number; // kW
  currentConsumption: number; // kW
  gridEfficiency: number; // percentage
  co2Savings: number; // kg
  energyProductionHistory: TimeSeriesDataPoint[];
  energyConsumptionHistory: TimeSeriesDataPoint[];
  energyMix: EnergyMixDataPoint[];
  devices: Device[];
}
