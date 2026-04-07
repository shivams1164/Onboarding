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
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No family members added</p>
            <Button onClick={onAdd} className="w-full gap-2 sm:w-auto">
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
        <Button onClick={onAdd} className="w-full gap-2 sm:w-auto">
          <Plus size={16} />
          Add Family Member
        </Button>
      </div>

      <div className="space-y-3 md:hidden">
        {family.map((member) => (
          <Card key={member.id} variant="default" className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</p>
                <p className="mt-1 text-sm text-gray-600">{member.relationship}</p>
              </div>
              {member.dependentStatus && (
                <Badge variant={member.dependentStatus === "DEPENDENT" ? "default" : "outline"}>
                  {member.dependentStatus}
                </Badge>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Date of Birth</p>
                <p className="mt-1 text-gray-900 dark:text-gray-100">{formatDate(member.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Contact</p>
                <p className="mt-1 text-gray-900 dark:text-gray-100">{member.mobileNumber || "N/A"}</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(member)} className="flex-1 gap-2">
                <Edit2 size={16} />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete?.(member.id)}
                className="flex-1 gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-sm dark:text-gray-100">
          <thead className="border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Relationship</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">DOB</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Dependent</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {family.map((member) => (
              <tr key={member.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{member.name}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{member.relationship}</Badge>
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{formatDate(member.dateOfBirth)}</td>
                <td className="px-4 py-3">
                  {member.dependentStatus && (
                    <Badge variant={member.dependentStatus === "DEPENDENT" ? "default" : "outline"}>
                      {member.dependentStatus}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit?.(member)} className="text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(member.id)}
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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
  const getDownloadUrl = (fileUrl: string): string => {
    try {
      const parsed = new URL(fileUrl);
      if (parsed.hostname.includes("res.cloudinary.com") && parsed.pathname.includes("/upload/")) {
        parsed.pathname = parsed.pathname.replace("/upload/", "/upload/fl_attachment/");
      }
      return parsed.toString();
    } catch {
      return fileUrl;
    }
  };

  const handleDownload = (doc: Document) => {
    const link = document.createElement("a");
    link.href = getDownloadUrl(doc.fileUrl);
    link.download = doc.fileName || "document";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No documents uploaded</p>
            <Button onClick={onUpload} className="w-full gap-2 sm:w-auto">
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
        <Button onClick={onUpload} className="w-full gap-2 sm:w-auto">
          <Plus size={16} />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline">{doc.type}</Badge>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">{doc.fileName}</h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(doc)} aria-label="Edit document">
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleDownload(doc)}
                    aria-label="Download document"
                  >
                    <Download size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete?.(doc.id)} className="text-red-600" aria-label="Delete document">
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
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No assets assigned</p>
            <Button onClick={onAdd} className="w-full gap-2 sm:w-auto">
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
        <Button onClick={onAdd} className="w-full gap-2 sm:w-auto">
          <Plus size={16} />
          Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary">{asset.type}</Badge>
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    {asset.serialNumber}
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(asset)} aria-label="Edit asset">
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(asset.id)}
                    className="text-red-600"
                    aria-label="Delete asset"
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
