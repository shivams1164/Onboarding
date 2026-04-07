// Employee component: Employee list table
"use client";
import React from "react";
import Link from "next/link";
import { Edit, Trash, Eye } from "lucide-react";
import { Badge } from "@/components/ui/FormElements";
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

  const mobileCards = employees.map((employee) => (
    <Card key={employee.id} variant="default" className="p-4">
      <div className="flex items-start gap-3">
        {employee.profilePhotoUrl ? (
          <img
            src={employee.profilePhotoUrl}
            alt={`${employee.firstName} ${employee.lastName}`}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
            {getInitials(employee.firstName, employee.lastName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <Link href={`/employees/${employee.id}`} className="block">
                <p className="text-base font-semibold leading-snug text-gray-900 break-words dark:text-gray-100">
                  {employee.firstName} {employee.lastName}
                </p>
              </Link>
              <p className="mt-0.5 text-sm text-gray-500">{employee.designation}</p>
            </div>
            <Badge variant={employee.status === "ACTIVE" ? "default" : "destructive"}>
              {employee.status}
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Employee ID</p>
              <p className="mt-1 font-mono text-gray-900 dark:text-gray-100">{employee.employeeId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">Department</p>
              <p className="mt-1 text-gray-900 dark:text-gray-100">{employee.department}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link
              href={`/employees/${employee.id}`}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
            >
              View
            </Link>
            <Button variant="outline" size="sm" onClick={() => onEdit?.(employee)} className="w-full justify-center">
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(employee)}
              className="w-full justify-center text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  ));

  return (
    <Card className="overflow-hidden p-0">
      <div className="space-y-3 p-4 md:hidden">{mobileCards}</div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-[780px] w-full">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/60">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {employee.profilePhotoUrl ? (
                      <img
                        src={employee.profilePhotoUrl}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                        {getInitials(employee.firstName, employee.lastName)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{employee.designation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-gray-100">{employee.employeeId}</td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{employee.department}</td>
                <td className="px-6 py-4">
                  <Badge variant={employee.status === "ACTIVE" ? "default" : "destructive"}>
                    {employee.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/employees/${employee.id}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800"
                      aria-label={`View ${employee.firstName} ${employee.lastName}`}
                    >
                      <Eye size={16} />
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit?.(employee)}
                      className="gap-1"
                      aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(employee)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
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
        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Page {currentPage + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex-1 sm:flex-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="flex-1 sm:flex-none"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
