
"use client";
import { useState, useEffect, useCallback } from "react";
import type { DashboardData, TimeSeriesDataPoint } from "@/types";
import { getInitialDashboardData, simulateDashboardDataUpdate } from "@/lib/mock-data";
import { getSystemMaintenancePrediction, type PredictiveMaintenanceOutput, type PredictiveMaintenanceInput } from "@/ai/flows/predictive-maintenance-flow";

import { EnergyProductionChart } from "@/components/dashboard/energy-production-chart";
import { EnergyConsumptionChart } from "@/components/dashboard/energy-consumption-chart";
import { GridEfficiencyDisplay } from "@/components/dashboard/grid-efficiency-display";
import { CO2SavingsDisplay } from "@/components/dashboard/co2-savings-display";
import { EnergyMixChart } from "@/components/dashboard/energy-mix-chart";
import { DeviceStatusList } from "@/components/dashboard/device-status-list";
import { SystemMaintenanceSummary } from "@/components/dashboard/system-maintenance-summary";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


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
          // Map Device type from @/types to DeviceType for the AI flow
          const devicesForAI: PredictiveMaintenanceInput['devices'] = data.devices.map(d => ({
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

          const prediction = await getSystemMaintenancePrediction({ devices: devicesForAI });
          setSystemMaintenancePrediction(prediction);
        } catch (error) {
          console.error("Error fetching maintenance prediction:", error);
          setSystemMaintenancePrediction(null); // Set to null or a specific error state
          toast({
            variant: "destructive",
            title: "Maintenance Prediction Error",
            description: "Could not fetch predictive maintenance insights. Please try again later.",
          });
        } finally {
          setIsPredictionLoading(false);
        }
      };
      // Fetch prediction initially and then on an interval, e.g., every 30 seconds
      // For now, let's fetch it when devices data changes, but be mindful of API call frequency in a real app.
      fetchPrediction();
      
      // Example of fetching less frequently:
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
        {[...Array(8)].map((_, i) => ( // Increased skeleton count for the new card
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
