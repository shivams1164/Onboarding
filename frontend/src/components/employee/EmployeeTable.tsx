// Employee component: Employee list table
"use client";
import React from "react";
import Link from "next/link";
import { Edit, Trash, Eye } from "lucide-react";
import { Badge, Input } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getInitials } from "@/lib/utils";
import type { Employee } from "@/types/employee";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  totalPages = 1,
  currentPage = 0,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading employees...</p>
        </div>
      </Card>
    );
  }

  if (employees.length === 0) {
    return (
      <Card>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No employees found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {employee.profilePhotoUrl ? (
                      <img
                        src={employee.profilePhotoUrl}
                        alt={employee.firstName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        {getInitials(employee.firstName, employee.lastName)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{employee.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-mono">{employee.employeeId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{employee.department}</td>
                <td className="px-6 py-4">
                  <Badge variant={employee.status === "ACTIVE" ? "default" : "destructive"}>
                    {employee.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href={`/employees/${employee.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye size={16} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(employee)}
                      className="gap-1"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(employee)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
