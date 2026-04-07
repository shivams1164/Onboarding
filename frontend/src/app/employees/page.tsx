// Employees list page
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/FormElements";
import { Card } from "@/components/ui/Card";
import { employeeApi } from "@/lib/api";
import { UserPlus, Filter } from "lucide-react";
import type { Employee } from "@/types/employee";

export default function EmployeesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  const departments = ["Engineering", "HR", "Sales", "Marketing", "Finance", "Operations"];
  const statusOptions = ["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"];

  useEffect(() => {
    const statusFromQuery = searchParams.get("status") || "";
    if (statusFromQuery && statusOptions.includes(statusFromQuery)) {
      setStatus(statusFromQuery);
      setCurrentPage(0);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchQuery, department, status]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeeApi.getAll(currentPage, 10, searchQuery);
      const payload = response.data?.data;
      const list: Employee[] = Array.isArray(payload) ? payload : payload?.content || [];

      const filtered = list.filter((employee) => {
        const matchesDepartment = department ? employee.department === department : true;
        const matchesStatus = status ? employee.status === status : true;

        return matchesDepartment && matchesStatus;
      });

      setEmployees(filtered);
      setTotalPages(Array.isArray(payload) ? 1 : payload?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setEmployees([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleEdit = (employee: Employee) => {
    router.push(`/employees/${employee.id}?tab=overview`);
  };

  const handleDelete = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`)) {
      employeeApi
        .delete(String(employee.id))
        .then(fetchEmployees)
        .catch((error) => console.error("Failed to delete employee:", error));
    }
  };

  return (
    <Layout onSearch={handleSearch}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Employees</h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">Manage all employees in the system</p>
          </div>
          <Link href="/employees/new">
            <Button className="w-full gap-2 sm:w-auto">
              <UserPlus size={18} />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </Select>

            <Select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(0);
              }}
            >
              <option value="">All Status</option>
              {statusOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </Select>

            <Button
              variant="outline"
              className="gap-2 xl:col-span-2"
              onClick={() => {
                setDepartment("");
                setStatus("");
                setSearchQuery("");
              }}
            >
              <Filter size={16} />
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
}
