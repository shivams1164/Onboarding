// Employee component: Profile tabs - Overview
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/FormElements";
import { formatDate, maskPhone } from "@/lib/utils";
import type { Employee } from "@/types/employee";
import { Mail, Phone, Calendar, MapPin, Briefcase } from "lucide-react";

interface OverviewTabProps {
  employee: Employee;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ employee }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail size={20} />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Email</p>
            <p className="text-gray-900">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Phone</p>
            <p className="text-gray-900">{maskPhone(employee.phone)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Job Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase size={20} />
            Job Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Designation</p>
            <p className="text-gray-900">{employee.designation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Department</p>
            <p className="text-gray-900">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Status</p>
            <Badge variant={employee.status === "ACTIVE" ? "default" : "destructive"}>
              {employee.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Employment Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Employment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Employee ID</p>
            <p className="text-gray-900 font-mono font-semibold">{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Date of Joining</p>
            <p className="text-gray-900">{formatDate(employee.dateOfJoining)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Education Records</p>
            <p className="text-2xl font-bold text-gray-900">{employee.education?.length || 0}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Family Members</p>
            <p className="text-2xl font-bold text-gray-900">{employee.family?.length || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
