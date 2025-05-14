"use client";
import { Leaf } from "lucide-react";
import { StatCard } from "./stat-card";

interface CO2SavingsDisplayProps {
  savings: number; // in kg
}

export function CO2SavingsDisplay({ savings }: CO2SavingsDisplayProps) {
  return (
    <StatCard
      title="CO₂ Savings"
      value={savings.toLocaleString()}
      unit="kg"
      icon={Leaf}
      description="Estimated CO₂ emissions avoided"
      className="h-full"
    >
       <p className="text-xs text-muted-foreground mt-2">
        Equivalent to <span className="font-semibold text-foreground">{(savings / 20).toFixed(1)}</span> trees planted this year.
      </p>
    </StatCard>
  );
}
