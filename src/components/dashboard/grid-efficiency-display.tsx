"use client";
import { Gauge } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "./stat-card";

interface GridEfficiencyDisplayProps {
  efficiency: number;
}

export function GridEfficiencyDisplay({ efficiency }: GridEfficiencyDisplayProps) {
  const getProgressColor = () => {
    if (efficiency >= 90) return "bg-green-500"; // hsl(var(--primary)) equivalent
    if (efficiency >= 75) return "bg-yellow-500"; // Some warning color
    return "bg-red-500"; // hsl(var(--destructive)) equivalent
  };

  return (
    <StatCard
      title="Grid Efficiency"
      value={`${efficiency.toFixed(1)}`}
      unit="%"
      icon={Gauge}
      description="System performance rating"
      className="h-full"
    >
      <div className="mt-4">
        <Progress value={efficiency} className="h-3 [&>div]:bg-primary" aria-label={`Grid efficiency: ${efficiency}%`} />
         <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
        </div>
      </div>
    </StatCard>
  );
}
