// Dashboard page
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { employeeApi } from "@/lib/api";
import type { Employee } from "@/types/employee";
import { Users, TrendingUp, AlertCircle, UserPlus } from "lucide-react";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeApi.getAll();
        const list = Array.isArray(response.data?.data) ? response.data.data : [];
        setEmployees(list);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((employee) => employee.status === "ACTIVE").length;
    const onLeaveEmployees = employees.filter((employee) => employee.status === "ON_LEAVE").length;

    return [
      { title: "Total Employees", value: String(totalEmployees), icon: Users, color: "bg-blue-500" },
      { title: "Active Employees", value: String(activeEmployees), icon: TrendingUp, color: "bg-green-500" },
      { title: "On Leave", value: String(onLeaveEmployees), icon: AlertCircle, color: "bg-yellow-500" },
    ];
  }, [employees]);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome to HRMS</p>
          </div>
          <Link href="/employees/new">
            <Button className="gap-2">
              <UserPlus size={18} />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg text-white`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <p className="text-gray-600">No recent activity available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
