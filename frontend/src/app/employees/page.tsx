// Employees list page
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layout } from "@/components/layout/Layout";
import { EmployeeTable } from "@/components/employee/EmployeeTable";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/FormElements";
import { Card } from "@/components/ui/Card";
import { employeeApi } from "@/lib/api";
import { UserPlus, Filter } from "lucide-react";
import type { Employee } from "@/types/employee";

export default function EmployeesPage() {
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
    console.log("Edit employee:", employee);
    // TODO: Navigate to edit page or open modal
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
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="text-gray-600 mt-1">Manage all employees in the system</p>
          </div>
          <Link href="/employees/new">
            <Button className="gap-2">
              <UserPlus size={18} />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCurrentPage(0);
              }}
              className="md:col-span-1"
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
              className="md:col-span-1"
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
              className="md:col-span-2 gap-2"
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
