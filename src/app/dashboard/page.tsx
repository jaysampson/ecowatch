"use client";
import { useState, useEffect, useCallback } from "react";
import type { DashboardData, TimeSeriesDataPoint } from "@/types";
import { getInitialDashboardData, simulateDashboardDataUpdate } from "@/lib/mock-data";

import { EnergyProductionChart } from "@/components/dashboard/energy-production-chart";
import { EnergyConsumptionChart } from "@/components/dashboard/energy-consumption-chart";
import { GridEfficiencyDisplay } from "@/components/dashboard/grid-efficiency-display";
import { CO2SavingsDisplay } from "@/components/dashboard/co2-savings-display";
import { EnergyMixChart } from "@/components/dashboard/energy-mix-chart";
import { DeviceStatusList } from "@/components/dashboard/device-status-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialData = getInitialDashboardData();
    setData(initialData);
    setIsLoading(false);

    const interval = setInterval(() => {
      setData((prevData) => prevData ? simulateDashboardDataUpdate(prevData) : null);
    }, 5000); // Simulate updates every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleProductionDataUpdate = useCallback((updatedHistory: TimeSeriesDataPoint[]) => {
    setData(prev => prev ? ({ ...prev, energyProductionHistory: updatedHistory }) : null);
  }, []);

  const handleConsumptionDataUpdate = useCallback((updatedHistory: TimeSeriesDataPoint[]) => {
     setData(prev => prev ? ({ ...prev, energyConsumptionHistory: updatedHistory }) : null);
  }, []);


  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
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
    </div>
  );
}
