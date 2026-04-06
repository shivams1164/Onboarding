// Employee component: Profile header with quick actions
"use client";
import React from "react";
import { Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import { getStatusColor, getInitials, maskPhone } from "@/lib/utils";
import type { Employee } from "@/types/employee";

interface EmployeeProfileHeaderProps {
  employee: Employee;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EmployeeProfileHeader: React.FC<EmployeeProfileHeaderProps> = ({
  employee,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 dark:bg-gray-900 dark:shadow-black/40">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Photo & Basic Info */}
        <div className="flex items-center gap-6">
          {employee.profilePhotoUrl ? (
            <img
              src={employee.profilePhotoUrl}
              alt={employee.firstName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold bg-blue-500`}>
              {getInitials(employee.firstName, employee.lastName)}
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-sm text-gray-600 mt-1 dark:text-gray-300">
              ID: <span className="font-semibold">{employee.employeeId}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {employee.designation} • {employee.department}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant={employee.status === "ACTIVE" ? "default" : "destructive"}>
                {employee.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex gap-2 w-full md:w-auto flex-wrap md:flex-nowrap">
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
            <Edit size={16} />
            <span className="hidden md:inline">Edit</span>
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="gap-2">
            <Trash size={16} />
            <span className="hidden md:inline">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
