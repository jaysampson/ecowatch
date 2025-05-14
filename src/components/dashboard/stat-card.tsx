"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type React from "react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ElementType;
  unit?: string;
  children?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}

export function StatCard({ title, value, description, icon: Icon, unit, children, className, footer }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {value}
          {unit && <span className="ml-1 text-xl font-medium text-muted-foreground">{unit}</span>}
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
      </CardContent>
      {footer && (
        <div className="border-t px-6 py-4 text-sm text-muted-foreground">
            {footer}
        </div>
      )}
    </Card>
  );
}
