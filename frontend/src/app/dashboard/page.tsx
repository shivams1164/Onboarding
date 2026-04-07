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
      { title: "Total Employees", value: String(totalEmployees), icon: Users, color: "bg-blue-500", href: "/employees" },
      { title: "Active Employees", value: String(activeEmployees), icon: TrendingUp, color: "bg-green-500", href: "/employees?status=ACTIVE" },
      { title: "On Leave", value: String(onLeaveEmployees), icon: AlertCircle, color: "bg-yellow-500", href: "/employees?status=ON_LEAVE" },
    ];
  }, [employees]);

  return (
    <Layout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600 md:text-base">Welcome to HRMS</p>
          </div>
          <Link href="/employees/new">
            <Button className="w-full justify-center gap-2 md:w-auto md:justify-start">
              <UserPlus size={18} />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.title} href={stat.href} className="block group">
                <Card className="cursor-pointer transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-xl px-4 py-4 md:px-6 md:py-6">
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm md:text-base text-gray-600">{stat.title}</p>
                        <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <p className="mt-2 text-xs md:text-sm text-gray-500 group-hover:text-gray-700">Click to view details</p>
                      </div>
                      <div className={`${stat.color} p-3 md:p-4 rounded-lg text-white shrink-0`}>
                        <Icon size={20} className="md:hidden" />
                        <Icon size={24} className="hidden md:block" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card className="p-4 md:p-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-6 md:py-8 text-center">
              <p className="text-sm md:text-base text-gray-600">No recent activity available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
