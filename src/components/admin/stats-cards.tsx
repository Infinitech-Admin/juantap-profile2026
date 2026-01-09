
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ShoppingBag, Eye } from "lucide-react";

export function StatsCards() {
  const [totalUsers, setTotalUsers] = useState<string>("...");
  const [totalTemplates, setTotalTemplates] = useState<string>("...");
  const [revenue, setRevenue] = useState<string>("...");
  const [pendingPayments, setPendingPayments] = useState<string>("...");

  useEffect(() => {
    async function fetchStats() {
      const token = localStorage.getItem("token");
      if (!token) {
        setTotalUsers("N/A");
        setTotalTemplates("N/A");
        setRevenue("N/A");
        setPendingPayments("N/A");
        return;
      }

      try {
        // Users
        const usersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/users-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const usersData = await usersRes.json();
        setTotalUsers(Number(usersData.count).toLocaleString());

        // Templates
        const templatesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/templates-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const templatesData = await templatesRes.json();
        setTotalTemplates(Number(templatesData.count).toLocaleString());

        // Revenue
        const revenueRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/revenue`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const revenueData = await revenueRes.json();
        setRevenue(`₱${Number(revenueData.total).toLocaleString()}`);

        // Pending payments
        const pendingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/stats/pending-payments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const pendingData = await pendingRes.json();
        setPendingPayments(Number(pendingData.count).toLocaleString());
      } catch (error) {
        console.error(error);
        setTotalUsers("N/A");
        setTotalTemplates("N/A");
        setRevenue("N/A");
        setPendingPayments("N/A");
      }
    }

    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Total Templates",
      value: totalTemplates,
      icon: FileText,
    },
    {
      title: "Revenue",
      value: revenue,
      icon: ShoppingBag,
    },
    {
      title: "Pending Payments",
      value: pendingPayments,
      icon: Eye,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`bg-white to-purple-500 p-6`}>
            <div className="flex items-center gap-3 my-5 mx-5">
              <Icon className={`h-12 w-12 text-gray-700 flex-shrink-0`} />
              <div className="flex flex-col m-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className="text-3xl font-bold text-gray-700">
                  {stat.value}
                </div>
              </div>
            </div>

          </Card>
        );
      })}
    </div>
  );
}
