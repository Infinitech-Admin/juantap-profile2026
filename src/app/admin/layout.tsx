"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
        collapsed={isSidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* min-w-0 lets this flex child shrink below its content width */}
      <main
        className={`min-w-0 flex-1 overflow-x-hidden p-4 transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Mobile toggle button */}
        <div className="md:hidden mb-4">
          <Button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-4 w-4 mr-2" />
            Open Menu
          </Button>
        </div>
        {children}
      </main>
    </div>
  );
}
