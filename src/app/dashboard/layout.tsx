import { AppHeader } from "@/components/layout/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | EcoWatch",
  description: "Real-time clean energy metrics.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-4 pt-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
