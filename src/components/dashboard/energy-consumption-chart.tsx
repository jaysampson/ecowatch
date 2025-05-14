"use client";
import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { TimeSeriesDataPoint } from "@/types";
import { Power } from "lucide-react"; // Using Power as a generic consumption icon

interface EnergyConsumptionChartProps {
  initialData: TimeSeriesDataPoint[];
  currentConsumption: number;
  onDataUpdate: (data: TimeSeriesDataPoint[]) => void;
}

const chartConfig = {
  consumption: {
    label: "Consumption (kW)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function EnergyConsumptionChart({ initialData, currentConsumption, onDataUpdate }: EnergyConsumptionChartProps) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
         <div className="grid gap-1">
            <CardTitle className="text-base font-semibold flex items-center">
                <Power className="h-5 w-5 mr-2 text-destructive" /> Energy Consumption
            </CardTitle>
            <CardDescription>Last 6 hours</CardDescription>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-destructive">{currentConsumption.toFixed(1)} <span className="text-lg font-normal text-muted-foreground">kW</span></p>
          <p className="text-xs text-muted-foreground">Current</p>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timestamp" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="kW" />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelKey="value" hideLabel />}
              />
              <Line
                dataKey="value"
                name="Consumption"
                type="monotone"
                stroke="var(--color-consumption)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
