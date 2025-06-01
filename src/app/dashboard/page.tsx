
"use client";
import { useState, useEffect, useCallback } from "react";
import type { DashboardData, TimeSeriesDataPoint, Device as AppDeviceType } from "@/types"; // Renamed Device to AppDeviceType to avoid conflict
import { getInitialDashboardData, simulateDashboardDataUpdate } from "@/lib/mock-data";
import { getSystemMaintenancePrediction, type PredictiveMaintenanceOutput, type PredictiveMaintenanceInput, type DeviceType as AIDeviceType } from "@/ai/flows/predictive-maintenance-flow"; // Renamed DeviceType to AIDeviceType

import { EnergyProductionChart } from "@/components/dashboard/energy-production-chart";
import { EnergyConsumptionChart } from "@/components/dashboard/energy-consumption-chart";
import { GridEfficiencyDisplay } from "@/components/dashboard/grid-efficiency-display";
import { CO2SavingsDisplay } from "@/components/dashboard/co2-savings-display";
import { EnergyMixChart } from "@/components/dashboard/energy-mix-chart";
import { DeviceStatusList } from "@/components/dashboard/device-status-list";
import { SystemMaintenanceSummary } from "@/components/dashboard/system-maintenance-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Mock prediction data function
const getMockMaintenancePrediction = (): PredictiveMaintenanceOutput => {
  // Simulate some devices being passed if needed for mock logic, or keep it static
  // For this example, a static mock is sufficient.
  return {
    overallSystemHealth: "Good",
    criticalDevices: [
      {
        deviceId: "device-mock-0",
        deviceName: "AlphaSun XT3000 #1 (Simulated)",
        prediction: "Minor efficiency dip noted. Recommend cleaning within 2 weeks.",
        reasoning: "Simulated: Efficiency has dropped by 5% over the last 72 hours, possibly due to surface dust.",
        recommendedActions: ["Clean solar panel surface (Simulated Action).", "Monitor efficiency post-cleaning (Simulated Action)."]
      },
      {
        deviceId: "device-mock-1",
        deviceName: "PowerWall X #2 (Simulated)",
        prediction: "Battery temperature slightly elevated. Monitor closely.",
        reasoning: "Simulated: Battery temperature is 38°C, which is 3°C above its usual peak.",
        recommendedActions: ["Ensure proper ventilation around the battery unit (Simulated Action).", "Check for any unusual sounds or smells (Simulated Action)."]
      }
    ],
    generalRecommendations: [
      "Ensure all device firmware is up to date (Simulated Recommendation).",
      "Perform visual inspection of all connections monthly (Simulated Recommendation)."
    ]
  };
};


export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemMaintenancePrediction, setSystemMaintenancePrediction] = useState<PredictiveMaintenanceOutput | null>(null);
  const [isPredictionLoading, setIsPredictionLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initialData = getInitialDashboardData();
    setData(initialData);
    setIsLoading(false);

    const interval = setInterval(() => {
      setData((prevData) => prevData ? simulateDashboardDataUpdate(prevData) : null);
    }, 5000); // Simulate updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.devices && data.devices.length > 0) {
      setIsPredictionLoading(true);
      const fetchPrediction = async () => {
        try {
          // Map Device type from @/types to AIDeviceType for the AI flow
          const devicesForAI: PredictiveMaintenanceInput['devices'] = data.devices.map((d: AppDeviceType): AIDeviceType => ({ // Explicitly type d and the return
            id: d.id,
            name: d.name,
            type: d.type,
            status: d.status,
            power: d.power,
            capacity: d.capacity,
            chargeLevel: d.chargeLevel,
            health: d.health,
            temperature: d.temperature,
          }));

          // console.log("Attempting to fetch REAL maintenance prediction for devices:", devicesForAI);
          // const prediction = await getSystemMaintenancePrediction({ devices: devicesForAI });
          
          // TEMPORARY: Use mock prediction data to bypass potential Genkit/API issues
          console.warn("USING MOCK MAINTENANCE PREDICTION DATA. Switch to real API call in /src/app/dashboard/page.tsx when ready.");
          const prediction = getMockMaintenancePrediction();
          // Simulate a delay as if an API call was made
          await new Promise(resolve => setTimeout(resolve, 1200)); 
          // End of temporary mock data section

          setSystemMaintenancePrediction(prediction);

        } catch (error) {
          console.error("Error during maintenance prediction process:", error);
          setSystemMaintenancePrediction(null); 
          toast({
            variant: "destructive",
            title: "Maintenance Prediction Error",
            description: "Could not fetch/process predictive maintenance insights. Displaying mock data if available, or check console.",
          });
        } finally {
          setIsPredictionLoading(false);
        }
      };
      
      fetchPrediction();
      
      const predictionInterval = setInterval(fetchPrediction, 60000); // Fetch every 60 seconds
      return () => clearInterval(predictionInterval);

    }
  }, [data?.devices, toast]);

  const handleProductionDataUpdate = useCallback((updatedHistory: TimeSeriesDataPoint[]) => {
    setData(prev => prev ? ({ ...prev, energyProductionHistory: updatedHistory }) : null);
  }, []);

  const handleConsumptionDataUpdate = useCallback((updatedHistory: TimeSeriesDataPoint[]) => {
     setData(prev => prev ? ({ ...prev, energyConsumptionHistory: updatedHistory }) : null);
  }, []);


  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid auto-rows-fr gap-4 md:gap-6 lg:gap-8">
      <div className="grid gap-4 md:gap-6 lg:gap-8 xl:grid-cols-2">
        <EnergyProductionChart 
            initialData={data.energyProductionHistory} 
            currentProduction={data.currentProduction}
            onDataUpdate={handleProductionDataUpdate} 
        />
        <EnergyConsumptionChart 
            initialData={data.energyConsumptionHistory} 
            currentConsumption={data.currentConsumption}
            onDataUpdate={handleConsumptionDataUpdate}
        />
      </div>

      <div className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 xl:grid-cols-3">
        <GridEfficiencyDisplay efficiency={data.gridEfficiency} />
        <CO2SavingsDisplay savings={data.co2Savings} />
        <EnergyMixChart initialData={data.energyMix} />
      </div>
      
      <DeviceStatusList devices={data.devices} />
      <SystemMaintenanceSummary predictionData={systemMaintenancePrediction} isLoading={isPredictionLoading} />
    </div>
  );
}

