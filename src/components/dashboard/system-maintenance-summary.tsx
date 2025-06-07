
"use client";
import type { PredictiveMaintenanceOutput, PredictiveMaintenanceInput } from "@/ai/flows/predictive-maintenance-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, Wrench, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SystemMaintenanceSummaryProps {
  predictionData: PredictiveMaintenanceOutput | null;
  isLoading: boolean;
}

const HealthStatusIcon = ({ status }: { status: string }) => {
  if (status === "Optimal" || status === "Good") return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (status === "Minor Concerns") return <Info className="h-5 w-5 text-yellow-500" />;
  if (status === "Action Required" || status === "Critical Alert") return <AlertTriangle className="h-5 w-5 text-red-500" />;
  return <Wrench className="h-5 w-5 text-muted-foreground" />;
};

const HealthStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  if (status === "Optimal" || status === "Good") return "default";
  if (status === "Minor Concerns") return "secondary";
  if (status === "Action Required" || status === "Critical Alert") return "destructive";
  return "outline";
}

export function SystemMaintenanceSummary({ predictionData, isLoading }: SystemMaintenanceSummaryProps) {
  if (isLoading) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
           <div className="space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!predictionData) {
    return (
      <Card className="col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" /> Predictive Maintenance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No maintenance prediction data available at the moment. Device data might still be loading or an error occurred.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center">
            <Wrench className="h-5 w-5 mr-2 text-primary" /> Predictive Maintenance Insights
        </CardTitle>
        <CardDescription>AI-powered analysis of your system's health and maintenance needs.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Overall System Health</h3>
          <div className="flex items-center gap-2">
            <HealthStatusIcon status={predictionData.overallSystemHealth} />
            <Badge variant={HealthStatusBadgeVariant(predictionData.overallSystemHealth)} className="text-sm">
              {predictionData.overallSystemHealth}
            </Badge>
          </div>
        </div>

        {predictionData.criticalDevices && predictionData.criticalDevices.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Critical Devices Requiring Attention</h3>
            <Accordion type="multiple" className="w-full">
              {predictionData.criticalDevices.map((device) => (
                <AccordionItem value={device.deviceId} key={device.deviceId}>
                  <AccordionTrigger className="text-base hover:no-underline">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" /> 
                        <span className="break-words text-left">{device.deviceName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pl-2 text-sm">
                    <p><span className="font-semibold">Prediction:</span> <span className="break-words">{device.prediction}</span></p>
                    <p><span className="font-semibold">Reasoning:</span> <span className="break-words">{device.reasoning}</span></p>
                    <div>
                      <h4 className="font-semibold mb-1">Recommended Actions:</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {device.recommendedActions.map((action, idx) => (
                          <li key={idx} className="break-words">{action}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
         {predictionData.criticalDevices && predictionData.criticalDevices.length === 0 && (
             <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Critical Devices</h3>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-muted-foreground">No critical device issues detected at this time.</p>
                </div>
            </div>
        )}

        {predictionData.generalRecommendations && predictionData.generalRecommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" /> General Recommendations
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-muted-foreground pl-4">
              {predictionData.generalRecommendations.map((rec, idx) => (
                <li key={idx} className="break-words">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
