// Employee component: Profile tabs - Address
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge, Label } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import type { Address } from "@/types/employee";
import { Plus, Edit2, Trash2, MapPin } from "lucide-react";

interface AddressTabProps {
  addresses: Address[] | undefined;
  onAdd?: () => void;
  onEdit?: (address: Address) => void;
  onDelete?: (addressId: string) => void;
}

export const AddressTab: React.FC<AddressTabProps> = ({
  addresses,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (!addresses || addresses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No addresses on file</p>
            <Button onClick={onAdd} className="gap-2">
              <Plus size={16} />
              Add Address
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
          Add Address
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-600" />
                  <Badge variant={address.isPrimary ? "default" : "secondary"}>
                    {address.type}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(address)}
                    className="gap-1"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(address.id)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-900 font-medium">{address.street}</p>
                <p className="text-gray-600">
                  {address.city}, {address.state}
                </p>
                <p className="text-gray-600">
                  {address.country} - {address.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
