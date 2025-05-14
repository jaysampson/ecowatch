"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Device } from "@/types";
import { Cpu, BatteryCharging, SolarPanel, AlertTriangle, CheckCircle2, XCircle, Thermometer, Zap, Percent } from "lucide-react";

interface DeviceStatusListProps {
  devices: Device[];
}

const DeviceIcon = ({ type }: { type: Device["type"] }) => {
  if (type === "Inverter") return <Cpu className="h-5 w-5 text-muted-foreground" />;
  if (type === "Battery") return <BatteryCharging className="h-5 w-5 text-muted-foreground" />;
  if (type === "Solar Panel") return <SolarPanel className="h-5 w-5 text-muted-foreground" />;
  return null;
};

const StatusIndicator = ({ status }: { status: Device["status"] }) => {
  if (status === "Online") return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  if (status === "Offline") return <XCircle className="h-5 w-5 text-red-500" />;
  if (status === "Warning") return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  return null;
};

export function DeviceStatusList({ devices }: DeviceStatusListProps) {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Device Status</CardTitle>
        <CardDescription>Overview of all connected energy devices</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell><DeviceIcon type={device.type} /></TableCell>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>
                  <Badge variant={device.status === "Online" ? "default" : device.status === "Warning" ? "outline" : "destructive"} className="flex items-center gap-1 w-fit">
                     <StatusIndicator status={device.status} />
                     {device.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  <div className="flex flex-col items-end gap-0.5">
                    {device.power !== undefined && <span className="flex items-center gap-1"><Zap size={12}/>{device.power.toFixed(1)} kW</span>}
                    {device.chargeLevel !== undefined && <span className="flex items-center gap-1"><BatteryCharging size={12}/>{device.chargeLevel}%</span>}
                    {device.health !== undefined && <span className="flex items-center gap-1"><Percent size={12}/>{device.health}% Health</span>}
                    {device.temperature !== undefined && <span className="flex items-center gap-1"><Thermometer size={12}/>{device.temperature}°C</span>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
