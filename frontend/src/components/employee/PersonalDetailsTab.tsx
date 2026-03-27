// Employee component: Profile tabs - Personal Details
"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge, Label } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import { formatDate, maskAadhar, maskPan, calculateAge } from "@/lib/utils";
import type { PersonalDetails } from "@/types/employee";
import { Edit2 } from "lucide-react";

interface PersonalDetailsTabProps {
  personalDetails: PersonalDetails | undefined;
  onEdit?: () => void;
}

export const PersonalDetailsTab: React.FC<PersonalDetailsTabProps> = ({ personalDetails, onEdit }) => {
  const [isEditMode, setIsEditMode] = useState(false);

  if (!personalDetails) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No personal details available</p>
            <Button onClick={onEdit}>Add Personal Details</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Personal Details</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className="gap-2"
        >
          <Edit2 size={16} />
          {isEditMode ? "Cancel" : "Edit"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date of Birth */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
            <p className="text-gray-900 mt-1">{formatDate(personalDetails.dateOfBirth)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Age: {calculateAge(personalDetails.dateOfBirth)} years
            </p>
          </div>

          {/* Gender */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Gender</Label>
            <p className="text-gray-900 mt-1">{personalDetails.gender}</p>
          </div>

          {/* Blood Group */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Blood Group</Label>
            <p className="text-gray-900 mt-1">{personalDetails.bloodGroup || "N/A"}</p>
          </div>

          {/* Marital Status */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Marital Status</Label>
            <p className="text-gray-900 mt-1">
              <Badge variant="outline">{personalDetails.maritalStatus}</Badge>
            </p>
          </div>

          {/* Nationality */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Nationality</Label>
            <p className="text-gray-900 mt-1">{personalDetails.nationality}</p>
          </div>

          {/* Aadhar */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Aadhar Number</Label>
            <p className="text-gray-900 mt-1 font-mono">
              {personalDetails.aadharNumber
                ? maskAadhar(personalDetails.aadharNumber)
                : "N/A"}
            </p>
          </div>

          {/* PAN */}
          <div>
            <Label className="text-sm font-medium text-gray-700">PAN Number</Label>
            <p className="text-gray-900 mt-1 font-mono">
              {personalDetails.panNumber ? maskPan(personalDetails.panNumber) : "N/A"}
            </p>
          </div>

          {/* Passport */}
          <div>
            <Label className="text-sm font-medium text-gray-700">Passport Number</Label>
            <p className="text-gray-900 mt-1 font-mono">
              {personalDetails.passportNumber || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
