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
    <div className="mb-6 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-900 dark:shadow-black/40 sm:p-5 md:p-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-6">
        {/* Left: Photo & Basic Info */}
        <div className="flex w-full items-center gap-4 md:gap-6">
          {employee.profilePhotoUrl ? (
            <img
              src={employee.profilePhotoUrl}
              alt={employee.firstName}
              className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 md:h-24 md:w-24"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white sm:h-20 sm:w-20 md:h-24 md:w-24 md:text-2xl">
              {getInitials(employee.firstName, employee.lastName)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sm:text-2xl">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              ID: <span className="font-semibold">{employee.employeeId}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {employee.designation} • {employee.department}
            </p>
            <div className="mt-2 flex gap-2">
              <Badge variant={employee.status === "ACTIVE" ? "default" : "destructive"}>
                {employee.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:flex-nowrap">
          <Button variant="outline" size="sm" onClick={onEdit} className="w-full gap-2 sm:w-auto">
            <Edit size={16} />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="w-full gap-2 sm:w-auto">
            <Trash size={16} />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
