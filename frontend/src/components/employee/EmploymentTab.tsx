// Employee component: Profile tabs - Employment
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge, Label } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Employment } from "@/types/employee";
import { Plus, Edit2, Trash2, Briefcase } from "lucide-react";

interface EmploymentTabProps {
  employment: Employment[] | undefined;
  onAdd?: () => void;
  onEdit?: (record: Employment) => void;
  onDelete?: (recordId: string) => void;
}

export const EmploymentTab: React.FC<EmploymentTabProps> = ({
  employment,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (!employment || employment.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No employment history</p>
            <Button onClick={onAdd} className="gap-2">
              <Plus size={16} />
              Add Employment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort: current job first
  const sorted = [...employment].sort((a, b) =>
    a.isCurrentJob ? -1 : b.isCurrentJob ? 1 : 0
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={onAdd} className="gap-2">
          <Plus size={16} />
          Add Employment
        </Button>
      </div>

      <div className="space-y-4">
        {sorted.map((record, index) => (
          <Card key={record.id} className={record.isCurrentJob ? "border-2 border-blue-500" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{record.jobTitle}</h3>
                    {record.isCurrentJob && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{record.department}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(record)}
                    className="gap-1"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(record.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Start Date</p>
                  <p className="text-gray-900 mt-1">{formatDate(record.startDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">End Date</p>
                  <p className="text-gray-900 mt-1">
                    {record.endDate ? formatDate(record.endDate) : "Ongoing"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Type</p>
                  <p className="text-gray-900 mt-1">{record.employmentType}</p>
                </div>
                {record.reportingManager && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Manager</p>
                    <p className="text-gray-900 mt-1">{record.reportingManager}</p>
                  </div>
                )}
                {record.salary && (
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Salary</p>
                    <p className="text-gray-900 mt-1">{formatCurrency(record.salary)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
