// Employee component: Profile tabs - Education
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { Education } from "@/types/employee";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface EducationTabProps {
  education: Education[] | undefined;
  onAdd?: () => void;
  onEdit?: (record: Education) => void;
  onDelete?: (recordId: string) => void;
}

export const EducationTab: React.FC<EducationTabProps> = ({
  education,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (!education || education.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No education records</p>
            <Button onClick={onAdd} className="gap-2">
              <Plus size={16} />
              Add Education
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={onAdd} className="gap-2">
          <Plus size={16} />
          Add Education
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {education.map((record) => (
          <Card key={record.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{record.degree}</h3>
                  <p className="text-sm text-gray-600">{record.fieldOfStudy}</p>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">School</p>
                  <p className="text-gray-900 mt-1">{record.school}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Duration</p>
                  <p className="text-gray-900 mt-1">
                    {formatDate(record.startDate)} - {formatDate(record.endDate)}
                  </p>
                </div>
              </div>

              {record.description && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Description</p>
                  <p className="text-gray-900 mt-1">{record.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
