// Employee component: Profile tabs - Family, Bank, Documents, Assets
"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/FormElements";
import { Button } from "@/components/ui/Button";
import { formatDate, maskBankAccount } from "@/lib/utils";
import type { FamilyMember, BankDetails, PFDetails, Document, Asset } from "@/types/employee";
import { Plus, Edit2, Trash2, Download } from "lucide-react";

// FAMILY TAB
interface FamilyTabProps {
  family: FamilyMember[] | undefined;
  onAdd?: () => void;
  onEdit?: (member: FamilyMember) => void;
  onDelete?: (memberId: string) => void;
}

export const FamilyTab: React.FC<FamilyTabProps> = ({ family, onAdd, onEdit, onDelete }) => {
  if (!family || family.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No family members added</p>
            <Button onClick={onAdd} className="gap-2">
              <Plus size={16} />
              Add Family Member
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
          Add Family Member
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Relationship</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">DOB</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Dependent</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {family.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-900">{member.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{member.relationship}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600">{formatDate(member.dateOfBirth)}</td>
                <td className="px-4 py-3">
                  {member.dependentStatus && (
                    <Badge variant={member.dependentStatus === "DEPENDENT" ? "default" : "outline"}>
                      {member.dependentStatus}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(member)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(member.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// BANK & PF TABS
interface BankPFTabProps {
  bankDetails: BankDetails | undefined;
  pfDetails: PFDetails | undefined;
  onEditBank?: () => void;
  onEditPF?: () => void;
}

export const BankPFTab: React.FC<BankPFTabProps> = ({
  bankDetails,
  pfDetails,
  onEditBank,
  onEditPF,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bank Details Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Bank Details</CardTitle>
          <Button variant="outline" size="sm" onClick={onEditBank} className="gap-2">
            <Edit2 size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          {bankDetails ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Account Holder</p>
                <p className="text-gray-900 mt-1">{bankDetails.accountHolderName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Bank Name</p>
                <p className="text-gray-900 mt-1">{bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">Account Number</p>
                <p className="text-gray-900 font-mono mt-1">
                  {maskBankAccount(bankDetails.accountNumber)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">IFSC Code</p>
                <p className="text-gray-900 font-mono mt-1">{bankDetails.ifscCode}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600">No bank details on file</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PF Details Card */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>PF Details</CardTitle>
          <Button variant="outline" size="sm" onClick={onEditPF} className="gap-2">
            <Edit2 size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          {pfDetails ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">UAN</p>
                <p className="text-gray-900 font-mono mt-1">{pfDetails.uan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">PF Number</p>
                <p className="text-gray-900 font-mono mt-1">{pfDetails.pfNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium uppercase">PF Joining Date</p>
                <p className="text-gray-900 mt-1">{formatDate(pfDetails.pfJoiningDate)}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-gray-600">No PF details on file</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// DOCUMENTS TAB
interface DocumentsTabProps {
  documents: Document[] | undefined;
  onUpload?: () => void;
  onEdit?: (document: Document) => void;
  onDelete?: (documentId: string) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onUpload,
  onEdit,
  onDelete,
}) => {
  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No documents uploaded</p>
            <Button onClick={onUpload} className="gap-2">
              <Plus size={16} />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button onClick={onUpload} className="gap-2">
          <Plus size={16} />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline">{doc.type}</Badge>
                  <h3 className="text-sm font-semibold text-gray-900 mt-2">{doc.fileName}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(doc)}>
                    <Edit2 size={16} />
                  </Button>
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Download size={16} />
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(doc.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              {doc.expiryDate && (
                <p className="text-sm text-gray-600">
                  Expires: {formatDate(doc.expiryDate)}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ASSETS TAB
interface AssetsTabProps {
  assets: Asset[] | undefined;
  onAdd?: () => void;
  onEdit?: (asset: Asset) => void;
  onDelete?: (assetId: string) => void;
}

export const AssetsTab: React.FC<AssetsTabProps> = ({
  assets,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (!assets || assets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No assets assigned</p>
            <Button onClick={onAdd} className="gap-2">
              <Plus size={16} />
              Add Asset
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
          Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary">{asset.type}</Badge>
                  <h3 className="text-sm font-semibold text-gray-900 mt-2">
                    {asset.serialNumber}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(asset)}>
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(asset.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Allocated: {formatDate(asset.allocationDate)}
                </p>
                {asset.notes && <p className="text-gray-600">{asset.notes}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
