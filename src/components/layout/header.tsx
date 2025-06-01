import { ThemeToggle } from "@/components/theme-toggle";
import { Leaf } from "lucide-react";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">EcoWatch - SmartGridX Dashboard</h1>
            <p className="text-xs text-muted-foreground">Developed by Imoyin Sampson</p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
