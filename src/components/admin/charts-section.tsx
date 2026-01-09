
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function ChartsSection() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [templateData, setTemplateData] = useState([]);
  const COLORS = ["#83beeeff", "#4764b6ff", "#95dbe7ff", "#c3f5baff", "#8ceecdff"];
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/user-growth`)
      .then((res) => res.json())
      .then((data) => setMonthlyData(data));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/template-distribution`)
      .then((res) => res.json())
      .then((data) => setTemplateData(data));
  }, []);

  return (
    <div className="space-y-6">
      <Card className="bg-white border-none">
        <CardHeader>
          <CardTitle className="text-gray-800">User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
              <XAxis dataKey="name" stroke="#a0a0a0ff" />
              <YAxis stroke="#a0a0a0ff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#a0a0a0ff"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>

      </Card>

      <Card className="bg-white border-none">
        <CardHeader>
          <CardTitle className="text-gray-800">Template Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={templateData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {templateData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(247, 247, 247, 1)',
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>

      </Card>
    </div>
  );
}
