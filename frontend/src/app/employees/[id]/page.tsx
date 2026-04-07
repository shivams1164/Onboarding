// Employee profile detail page
"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { EmployeeProfileHeader } from "@/components/employee/EmployeeProfileHeader";
import { OverviewTab } from "@/components/employee/OverviewTab";
import { PersonalDetailsTab } from "@/components/employee/PersonalDetailsTab";
import { AddressTab } from "@/components/employee/AddressTab";
import { EducationTab } from "@/components/employee/EducationTab";
import { EmploymentTab } from "@/components/employee/EmploymentTab";
import { FamilyTab, BankPFTab, DocumentsTab, AssetsTab } from "@/components/employee/OtherTabs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input, Select, Label, FormError, Textarea } from "@/components/ui/FormElements";
import { employeeApi } from "@/lib/api";
import type {
  Address,
  Asset,
  BankDetails,
  Document,
  Education,
  Employee,
  Employment,
  FamilyMember,
  PFDetails,
} from "@/types/employee";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import axios from "axios";

type Notice = {
  type: "success" | "error";
  text: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const UAN_REGEX = /^\d{12}$/;
const NAME_ONLY_REGEX = /^[A-Za-z ]+$/;
const BANK_TEXT_REGEX = /^[A-Za-z0-9 .,&'()\/-]+$/;
const ACCOUNT_NUMBER_REGEX = /^\d{10,18}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const BANK_ACCOUNT_DIGITS: Record<string, number> = {
  "state bank of india": 11,
  "hdfc bank": 14,
  "icici bank": 12,
  "axis bank": 15,
  "kotak mahindra bank": 14,
  "bank of baroda": 14,
  "canara bank": 13,
  "punjab national bank": 16,
  "union bank of india": 15,
  "indian bank": 9,
  "indian overseas bank": 15,
  "bank of india": 15,
  "idbi": 13,
  "yes bank": 15,
  "uco bank": 14,
};
const SUPPORTED_DOC_TYPES = ["application/pdf", "image/png", "image/jpeg"];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const TAB_KEYS = [
  "overview",
  "personal",
  "address",
  "education",
  "employment",
  "family",
  "bank",
  "documents",
  "assets",
] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TAB_OPTIONS: Array<{ value: TabKey; label: string }> = [
  { value: "overview", label: "Overview" },
  { value: "personal", label: "Personal" },
  { value: "address", label: "Address" },
  { value: "education", label: "Education" },
  { value: "employment", label: "Employment" },
  { value: "family", label: "Family" },
  { value: "bank", label: "Bank & PF" },
  { value: "documents", label: "Documents" },
  { value: "assets", label: "Assets" },
];

function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidTab(value: string | null): value is TabKey {
  return !!value && TAB_KEYS.includes(value as TabKey);
}

function getExpectedAccountDigits(bankName: string): number | null {
  const normalized = bankName.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const direct = BANK_ACCOUNT_DIGITS[normalized];
  if (direct) {
    return direct;
  }

  const matchedKey = Object.keys(BANK_ACCOUNT_DIGITS).find((key) => normalized.includes(key));
  return matchedKey ? BANK_ACCOUNT_DIGITS[matchedKey] : null;
}

const emptyAddressForm = {
  type: "CURRENT",
  street: "",
  city: "",
  state: "",
  country: "India",
  zipCode: "",
  isPrimary: false,
};

const emptyEducationForm = {
  degree: "",
  fieldOfStudy: "",
  school: "",
  startDate: "",
  endDate: "",
  description: "",
  certificateUrl: "",
};

const emptyEmploymentForm = {
  companyName: "",
  jobTitle: "",
  department: "",
  startDate: "",
  endDate: "",
  isCurrentJob: true,
  reportingManager: "",
  salary: "",
  employmentType: "FULL_TIME",
};

const emptyFamilyForm = {
  name: "",
  relationship: "SPOUSE",
  dateOfBirth: "",
  mobileNumber: "",
  dependentStatus: "DEPENDENT",
};

const emptyDocumentForm = {
  type: "OTHER",
  fileName: "",
  fileUrl: "",
  expiryDate: "",
};

const emptyAssetForm = {
  type: "LAPTOP",
  serialNumber: "",
  allocationDate: "",
  notes: "",
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      String(error.response?.data?.message || "") ||
      error.message ||
      "Request failed"
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

export default function EmployeeDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const employeeId = params.id as string;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [notice, setNotice] = useState<Notice | null>(null);

  const [personalOpen, setPersonalOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [employmentOpen, setEmploymentOpen] = useState(false);
  const [familyOpen, setFamilyOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [pfOpen, setPfOpen] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);

  const [personalForm, setPersonalForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    bloodGroup: "",
    maritalStatus: "SINGLE",
    nationality: "Indian",
    aadharNumber: "",
    panNumber: "",
    passportNumber: "",
  });
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [educationForm, setEducationForm] = useState(emptyEducationForm);
  const [employmentForm, setEmploymentForm] = useState(emptyEmploymentForm);
  const [familyForm, setFamilyForm] = useState(emptyFamilyForm);
  const [bankForm, setBankForm] = useState({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branchName: "",
    accountType: "SAVINGS",
  });
  const [pfForm, setPfForm] = useState({
    uan: "",
    pfNumber: "",
    pfJoiningDate: "",
    employeeContribution: "",
    employerContribution: "",
  });
  const [documentForm, setDocumentForm] = useState(emptyDocumentForm);
  const [assetForm, setAssetForm] = useState(emptyAssetForm);

  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [editingEmploymentId, setEditingEmploymentId] = useState<string | null>(null);
  const [editingFamilyId, setEditingFamilyId] = useState<string | null>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  const [fieldError, setFieldError] = useState<string>("");
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [bankOptions, setBankOptions] = useState<string[]>([]);
  const [isLoadingBankOptions, setIsLoadingBankOptions] = useState(false);
  const [isFetchingIfsc, setIsFetchingIfsc] = useState(false);
  const [ifscLookupError, setIfscLookupError] = useState("");
  const [lastIfscLookup, setLastIfscLookup] = useState("");
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);
  const todayDate = useMemo(() => getTodayDateString(), []);

  const isEditingAddress = useMemo(() => !!editingAddressId, [editingAddressId]);
  const isEditingEducation = useMemo(() => !!editingEducationId, [editingEducationId]);
  const isEditingEmployment = useMemo(() => !!editingEmploymentId, [editingEmploymentId]);
  const isEditingFamily = useMemo(() => !!editingFamilyId, [editingFamilyId]);
  const isEditingDocument = useMemo(() => !!editingDocumentId, [editingDocumentId]);
  const isEditingAsset = useMemo(() => !!editingAssetId, [editingAssetId]);
  const expectedAccountDigits = useMemo(
    () => getExpectedAccountDigits(bankForm.bankName),
    [bankForm.bankName]
  );
  const filteredBankOptions = useMemo(() => {
    const query = bankForm.bankName.trim().toLowerCase();
    if (!query) {
      return bankOptions;
    }

    return bankOptions.filter((name) => name.toLowerCase().includes(query));
  }, [bankForm.bankName, bankOptions]);

  const updateTabInUrl = useCallback(
    (tab: TabKey) => {
      if (!employeeId) return;
      router.replace(`/employees/${employeeId}?tab=${tab}`, { scroll: false });
    },
    [employeeId, router]
  );

  const handleTabChange = useCallback(
    (value: string) => {
      if (!isValidTab(value)) {
        return;
      }
      setActiveTab(value);
      const storageKey = `employee-active-tab-${employeeId}`;
      window.sessionStorage.setItem(storageKey, value);
      updateTabInUrl(value);
    },
    [employeeId, updateTabInUrl]
  );

  useEffect(() => {
    if (!employeeId) return;

    const urlTab = searchParams.get("tab");
    const storageKey = `employee-active-tab-${employeeId}`;
    const storedTab = typeof window !== "undefined" ? window.sessionStorage.getItem(storageKey) : null;

    if (isValidTab(urlTab)) {
      setActiveTab(urlTab);
      window.sessionStorage.setItem(storageKey, urlTab);
      return;
    }

    if (isValidTab(storedTab)) {
      setActiveTab(storedTab);
      updateTabInUrl(storedTab);
      return;
    }

    setActiveTab("overview");
    window.sessionStorage.setItem(storageKey, "overview");
    updateTabInUrl("overview");
  }, [employeeId, searchParams, updateTabInUrl]);

  const fetchEmployeeDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const [employeeRes, personalRes, addressesRes, educationRes, employmentRes, familyRes, bankRes, pfRes, documentsRes, assetsRes] =
        await Promise.allSettled([
          employeeApi.getById(employeeId),
          employeeApi.getPersonalDetails(employeeId),
          employeeApi.getAddresses(employeeId),
          employeeApi.getEducation(employeeId),
          employeeApi.getEmployment(employeeId),
          employeeApi.getFamily(employeeId),
          employeeApi.getBankDetails(employeeId),
          employeeApi.getPFDetails(employeeId),
          employeeApi.getDocuments(employeeId),
          employeeApi.getAssets(employeeId),
        ]);

      if (employeeRes.status !== "fulfilled") {
        setEmployee(null);
        return;
      }

      const baseEmployee = employeeRes.value.data?.data;
      if (!baseEmployee) {
        setEmployee(null);
        return;
      }

      const nextEmployee: Employee = {
        ...baseEmployee,
        personalDetails:
          personalRes.status === "fulfilled"
            ? personalRes.value.data?.data ?? undefined
            : baseEmployee.personalDetails,
        addresses:
          addressesRes.status === "fulfilled"
            ? addressesRes.value.data?.data || []
            : baseEmployee.addresses || [],
        education:
          educationRes.status === "fulfilled"
            ? educationRes.value.data?.data || []
            : baseEmployee.education || [],
        employment:
          employmentRes.status === "fulfilled"
            ? employmentRes.value.data?.data || []
            : baseEmployee.employment || [],
        family:
          familyRes.status === "fulfilled"
            ? familyRes.value.data?.data || []
            : baseEmployee.family || [],
        bankDetails:
          bankRes.status === "fulfilled"
            ? bankRes.value.data?.data ?? undefined
            : baseEmployee.bankDetails,
        pfDetails:
          pfRes.status === "fulfilled"
            ? pfRes.value.data?.data ?? undefined
            : baseEmployee.pfDetails,
        documents:
          documentsRes.status === "fulfilled"
            ? documentsRes.value.data?.data || []
            : baseEmployee.documents || [],
        assets:
          assetsRes.status === "fulfilled"
            ? assetsRes.value.data?.data || []
            : baseEmployee.assets || [],
      };

      setEmployee(nextEmployee);
    } catch (error) {
      console.error("Failed to fetch employee:", error);
      setNotice({ type: "error", text: getErrorMessage(error) });
      setEmployee(null);
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchEmployeeDetails();
  }, [fetchEmployeeDetails]);

  const runMutation = async (operation: () => Promise<void>, successMessage: string) => {
    setIsSaving(true);
    setFieldError("");
    try {
      await operation();
      setNotice({ type: "success", text: successMessage });
      await fetchEmployeeDetails();
    } catch (error) {
      setFieldError(getErrorMessage(error));
      setNotice({ type: "error", text: getErrorMessage(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!employee) return;
    const confirmed = window.confirm(`Delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`);
    if (!confirmed) return;

    setIsSaving(true);
    setFieldError("");
    try {
      await employeeApi.delete(employeeId);
      setNotice({ type: "success", text: "Employee deleted successfully." });
      router.push("/employees");
    } catch (error) {
      const message = getErrorMessage(error);
      setFieldError(message);
      setNotice({ type: "error", text: message });
    } finally {
      setIsSaving(false);
    }
  };

  const openPersonalDialog = () => {
    if (!employee) return;
    setFieldError("");
    setPersonalForm({
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      dateOfBirth: employee.personalDetails?.dateOfBirth || "",
      gender: employee.personalDetails?.gender || "MALE",
      bloodGroup: employee.personalDetails?.bloodGroup || "",
      maritalStatus: employee.personalDetails?.maritalStatus || "SINGLE",
      nationality: employee.personalDetails?.nationality || "Indian",
      aadharNumber: employee.personalDetails?.aadharNumber || "",
      panNumber: employee.personalDetails?.panNumber || "",
      passportNumber: employee.personalDetails?.passportNumber || "",
    });
    setPersonalOpen(true);
  };

  const savePersonalDetails = async () => {
    if (!employee) return;
    if (!personalForm.firstName.trim() || !personalForm.lastName.trim()) {
      setFieldError("First name and last name are required.");
      return;
    }
    if (!EMAIL_REGEX.test(personalForm.email.trim())) {
      setFieldError("Please enter a valid email address.");
      return;
    }
    if (!PHONE_REGEX.test(personalForm.phone.trim())) {
      setFieldError("Phone number must be exactly 10 digits.");
      return;
    }
    if (personalForm.dateOfBirth && personalForm.dateOfBirth > todayDate) {
      setFieldError("Date of birth cannot be in the future.");
      return;
    }

    await runMutation(async () => {
      await employeeApi.update(employeeId, {
        firstName: personalForm.firstName.trim(),
        lastName: personalForm.lastName.trim(),
        email: personalForm.email.trim(),
        phone: personalForm.phone.trim(),
        employeeId: employee.employeeId,
        designation: employee.designation,
        department: employee.department,
        dateOfJoining: employee.dateOfJoining,
        status: employee.status,
      });

      await employeeApi.updatePersonalDetails(employeeId, {
        dateOfBirth: personalForm.dateOfBirth || null,
        gender: personalForm.gender,
        bloodGroup: personalForm.bloodGroup || null,
        maritalStatus: personalForm.maritalStatus,
        nationality: personalForm.nationality || null,
        aadharNumber: personalForm.aadharNumber || null,
        panNumber: personalForm.panNumber || null,
        passportNumber: personalForm.passportNumber || null,
      });
      setPersonalOpen(false);
    }, "Personal details saved successfully.");
  };

  const deletePersonalDetails = async () => {
    if (!window.confirm("Delete personal details?")) return;
    await runMutation(async () => {
      await employeeApi.deletePersonalDetails(employeeId);
      setPersonalOpen(false);
    }, "Personal details deleted successfully.");
  };

  const openAddressDialog = (address?: Address) => {
    setFieldError("");
    if (!address) {
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm);
    } else {
      setEditingAddressId(String(address.id));
      setAddressForm({
        type: address.type || "CURRENT",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        country: address.country || "India",
        zipCode: address.zipCode || "",
        isPrimary: !!address.isPrimary,
      });
    }
    setAddressOpen(true);
  };

  const saveAddress = async () => {
    if (!addressForm.street.trim() || !addressForm.city.trim() || !addressForm.state.trim() || !addressForm.country.trim() || !addressForm.zipCode.trim()) {
      setFieldError("All address fields are required.");
      return;
    }
    await runMutation(async () => {
      if (isEditingAddress && editingAddressId) {
        await employeeApi.updateAddress(employeeId, editingAddressId, addressForm);
      } else {
        await employeeApi.addAddress(employeeId, addressForm);
      }
      setAddressOpen(false);
      setEditingAddressId(null);
    }, `Address ${isEditingAddress ? "updated" : "added"} successfully.`);
  };

  const deleteAddress = async (addressId: string) => {
    if (!window.confirm("Delete this address?")) return;
    await runMutation(async () => {
      await employeeApi.deleteAddress(employeeId, String(addressId));
    }, "Address deleted successfully.");
  };

  const openEducationDialog = (record?: Education) => {
    setFieldError("");
    if (!record) {
      setEditingEducationId(null);
      setEducationForm(emptyEducationForm);
    } else {
      setEditingEducationId(String(record.id));
      setEducationForm({
        degree: record.degree || "",
        fieldOfStudy: record.fieldOfStudy || "",
        school: record.school || "",
        startDate: record.startDate || "",
        endDate: record.endDate || "",
        description: record.description || "",
        certificateUrl: record.certificateUrl || "",
      });
    }
    setEducationOpen(true);
  };

  const saveEducation = async () => {
    if (!educationForm.degree.trim() || !educationForm.fieldOfStudy.trim() || !educationForm.school.trim() || !educationForm.startDate.trim()) {
      setFieldError("Degree, field of study, institution, and start date are required.");
      return;
    }
    if (educationForm.startDate > todayDate) {
      setFieldError("Education start date cannot be in the future.");
      return;
    }
    if (educationForm.endDate && educationForm.endDate > todayDate) {
      setFieldError("Education end date cannot be in the future.");
      return;
    }
    if (educationForm.endDate && educationForm.endDate < educationForm.startDate) {
      setFieldError("Education end date cannot be earlier than start date.");
      return;
    }
    await runMutation(async () => {
      if (isEditingEducation && editingEducationId) {
        await employeeApi.updateEducation(employeeId, editingEducationId, educationForm);
      } else {
        await employeeApi.addEducation(employeeId, educationForm);
      }
      setEducationOpen(false);
      setEditingEducationId(null);
    }, `Education ${isEditingEducation ? "updated" : "added"} successfully.`);
  };

  const deleteEducation = async (recordId: string) => {
    if (!window.confirm("Delete this education record?")) return;
    await runMutation(async () => {
      await employeeApi.deleteEducation(employeeId, String(recordId));
    }, "Education deleted successfully.");
  };

  const openEmploymentDialog = (record?: Employment) => {
    setFieldError("");
    if (!record) {
      setEditingEmploymentId(null);
      setEmploymentForm(emptyEmploymentForm);
    } else {
      setEditingEmploymentId(String(record.id));
      setEmploymentForm({
        companyName: record.companyName || "",
        jobTitle: record.jobTitle || "",
        department: record.department || "",
        startDate: record.startDate || "",
        endDate: record.endDate || "",
        isCurrentJob: !!record.isCurrentJob,
        reportingManager: record.reportingManager || "",
        salary: record.salary ? String(record.salary) : "",
        employmentType: record.employmentType || "FULL_TIME",
      });
    }
    setEmploymentOpen(true);
  };

  const saveEmployment = async () => {
    if (!employmentForm.companyName.trim() || !employmentForm.jobTitle.trim() || !employmentForm.department.trim() || !employmentForm.startDate.trim()) {
      setFieldError("Company name, job title, department, and start date are required.");
      return;
    }
    if (employmentForm.startDate > todayDate) {
      setFieldError("Start date cannot be in the future.");
      return;
    }
    if (employmentForm.endDate && employmentForm.endDate > todayDate) {
      setFieldError("End date cannot be in the future.");
      return;
    }
    if (employmentForm.endDate && employmentForm.endDate < employmentForm.startDate) {
      setFieldError("End date cannot be earlier than start date.");
      return;
    }
    await runMutation(async () => {
      const payload = {
        ...employmentForm,
        isCurrentJob: employmentForm.endDate ? false : employmentForm.isCurrentJob,
        salary: employmentForm.salary ? Number(employmentForm.salary) : null,
      };
      if (isEditingEmployment && editingEmploymentId) {
        await employeeApi.updateEmployment(employeeId, editingEmploymentId, payload);
      } else {
        await employeeApi.addEmployment(employeeId, payload);
      }
      setEmploymentOpen(false);
      setEditingEmploymentId(null);
    }, `Employment ${isEditingEmployment ? "updated" : "added"} successfully.`);
  };

  const deleteEmployment = async (recordId: string) => {
    if (!window.confirm("Delete this employment record?")) return;
    await runMutation(async () => {
      await employeeApi.deleteEmployment(employeeId, String(recordId));
    }, "Employment deleted successfully.");
  };

  const openFamilyDialog = (member?: FamilyMember) => {
    setFieldError("");
    if (!member) {
      setEditingFamilyId(null);
      setFamilyForm(emptyFamilyForm);
    } else {
      setEditingFamilyId(String(member.id));
      setFamilyForm({
        name: member.name || "",
        relationship: member.relationship || "SPOUSE",
        dateOfBirth: member.dateOfBirth || "",
        mobileNumber: member.mobileNumber || "",
        dependentStatus: member.dependentStatus || "DEPENDENT",
      });
    }
    setFamilyOpen(true);
  };

  const saveFamily = async () => {
    if (!familyForm.name.trim() || !familyForm.dateOfBirth.trim()) {
      setFieldError("Name and date of birth are required.");
      return;
    }
    if (familyForm.dateOfBirth > todayDate) {
      setFieldError("Date of birth cannot be in the future.");
      return;
    }
    if (familyForm.mobileNumber && !PHONE_REGEX.test(familyForm.mobileNumber)) {
      setFieldError("Contact number must be 10 digits.");
      return;
    }
    await runMutation(async () => {
      if (isEditingFamily && editingFamilyId) {
        await employeeApi.updateFamilyMember(employeeId, editingFamilyId, familyForm);
      } else {
        await employeeApi.addFamilyMember(employeeId, familyForm);
      }
      setFamilyOpen(false);
      setEditingFamilyId(null);
    }, `Family member ${isEditingFamily ? "updated" : "added"} successfully.`);
  };

  const deleteFamilyMember = async (memberId: string) => {
    if (!window.confirm("Delete this family member?")) return;
    await runMutation(async () => {
      await employeeApi.deleteFamilyMember(employeeId, String(memberId));
    }, "Family member deleted successfully.");
  };

  const openBankDialog = (details?: BankDetails) => {
    setFieldError("");
    setIfscLookupError("");
    setLastIfscLookup("");
    setShowBankSuggestions(false);
    setBankForm({
      accountHolderName: details?.accountHolderName || "",
      accountNumber: details?.accountNumber || "",
      ifscCode: details?.ifscCode || "",
      bankName: details?.bankName || "",
      branchName: details?.branchName || "",
      accountType: details?.accountType || "SAVINGS",
    });
    setBankOpen(true);
  };

  const fetchBankNames = useCallback(async () => {
    if (bankOptions.length > 0 || isLoadingBankOptions) {
      return;
    }

    setIsLoadingBankOptions(true);
    try {
      const response = await fetch("/api/banks/list", { cache: "force-cache" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to load bank list.");
      }
      setBankOptions(Array.isArray(data?.banks) ? data.banks : []);
    } catch (error) {
      setIfscLookupError(getErrorMessage(error));
    } finally {
      setIsLoadingBankOptions(false);
    }
  }, [bankOptions.length, isLoadingBankOptions]);

  useEffect(() => {
    if (!bankOpen) return;
    fetchBankNames();
  }, [bankOpen, fetchBankNames]);

  const lookupIfscDetails = useCallback(
    async (forceLookup: boolean) => {
      const normalizedIfsc = bankForm.ifscCode.trim().toUpperCase();

      if (!normalizedIfsc) {
        if (forceLookup) {
          setIfscLookupError("Please enter IFSC code.");
        }
        return;
      }

      if (!IFSC_REGEX.test(normalizedIfsc)) {
        if (forceLookup || normalizedIfsc.length === 11) {
          setIfscLookupError("Invalid IFSC format. Example: HDFC0123456");
        }
        return;
      }

      if (!forceLookup && lastIfscLookup === normalizedIfsc) {
        return;
      }

      setIsFetchingIfsc(true);
      setIfscLookupError("");

      try {
        const response = await fetch(`/api/banks/ifsc/${normalizedIfsc}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to fetch IFSC details.");
        }

        setBankForm((prev) => ({
          ...prev,
          ifscCode: normalizedIfsc,
          branchName: data?.branch || prev.branchName,
        }));
        setLastIfscLookup(normalizedIfsc);
      } catch (error) {
        setIfscLookupError(getErrorMessage(error));
      } finally {
        setIsFetchingIfsc(false);
      }
    },
    [bankForm.ifscCode, lastIfscLookup]
  );

  const saveBankDetails = async () => {
    const accountHolderName = bankForm.accountHolderName.trim();
    const accountNumber = bankForm.accountNumber.trim();
    const ifscCode = bankForm.ifscCode.trim().toUpperCase();
    const bankName = bankForm.bankName.trim();
    const branchName = bankForm.branchName.trim();

    if (!accountHolderName) {
      setFieldError("Account holder name is required.");
      return;
    }
    if (!bankName) {
      setFieldError("Bank name is required.");
      return;
    }
    if (!accountNumber) {
      setFieldError("Account number is required.");
      return;
    }
    if (!ifscCode) {
      setFieldError("IFSC code is required.");
      return;
    }
    if (!branchName) {
      setFieldError("Branch name is required.");
      return;
    }
    if (!NAME_ONLY_REGEX.test(accountHolderName)) {
      setFieldError("Account holder name should contain only letters and spaces.");
      return;
    }
    if (!BANK_TEXT_REGEX.test(bankName)) {
      setFieldError("Bank name contains invalid characters.");
      return;
    }
    if (branchName && !BANK_TEXT_REGEX.test(branchName)) {
      setFieldError("Branch name contains invalid characters.");
      return;
    }
    if (!ACCOUNT_NUMBER_REGEX.test(accountNumber)) {
      setFieldError("Account number must be 10 to 18 digits.");
      return;
    }
    if (expectedAccountDigits && accountNumber.length !== expectedAccountDigits) {
      setFieldError(`For ${bankName}, account number must be exactly ${expectedAccountDigits} digits.`);
      return;
    }
    if (!IFSC_REGEX.test(ifscCode)) {
      setFieldError("Invalid IFSC format. Example: HDFC0123456");
      return;
    }
    await runMutation(async () => {
      await employeeApi.updateBankDetails(employeeId, {
        ...bankForm,
        accountHolderName,
        accountNumber,
        ifscCode,
        bankName,
        branchName,
      });
      setBankOpen(false);
    }, "Bank details saved successfully.");
  };

  const deleteBankDetails = async () => {
    if (!window.confirm("Delete bank details?")) return;
    await runMutation(async () => {
      await employeeApi.deleteBankDetails(employeeId);
      setBankOpen(false);
    }, "Bank details deleted successfully.");
  };

  const openPFDialog = (details?: PFDetails) => {
    setFieldError("");
    setPfForm({
      uan: details?.uan || "",
      pfNumber: details?.pfNumber || "",
      pfJoiningDate: details?.pfJoiningDate || "",
      employeeContribution: details?.employeeContribution ? String(details.employeeContribution) : "",
      employerContribution: details?.employerContribution ? String(details.employerContribution) : "",
    });
    setPfOpen(true);
  };

  const savePFDetails = async () => {
    if (!pfForm.uan.trim() || !pfForm.pfNumber.trim() || !pfForm.pfJoiningDate.trim()) {
      setFieldError("UAN, PF number and joining date are required.");
      return;
    }
    if (!UAN_REGEX.test(pfForm.uan.trim())) {
      setFieldError("UAN must be exactly 12 digits.");
      return;
    }
    if (pfForm.pfJoiningDate > todayDate) {
      setFieldError("PF joining date cannot be in the future.");
      return;
    }
    await runMutation(async () => {
      await employeeApi.updatePFDetails(employeeId, {
        ...pfForm,
        employeeContribution: pfForm.employeeContribution ? Number(pfForm.employeeContribution) : 0,
        employerContribution: pfForm.employerContribution ? Number(pfForm.employerContribution) : 0,
      });
      setPfOpen(false);
    }, "PF details saved successfully.");
  };

  const deletePFDetails = async () => {
    if (!window.confirm("Delete PF details?")) return;
    await runMutation(async () => {
      await employeeApi.deletePFDetails(employeeId);
      setPfOpen(false);
    }, "PF details deleted successfully.");
  };

  const openDocumentDialog = (doc?: Document) => {
    setFieldError("");
    if (!doc) {
      setEditingDocumentId(null);
      setDocumentForm(emptyDocumentForm);
    } else {
      setEditingDocumentId(String(doc.id));
      setDocumentForm({
        type: doc.type || "OTHER",
        fileName: doc.fileName || "",
        fileUrl: doc.fileUrl || "",
        expiryDate: doc.expiryDate || "",
      });
    }
    setDocumentOpen(true);
  };

  const uploadDocumentToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/cloudinary/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data?.secureUrl) {
      throw new Error(data?.error || "Cloudinary upload failed.");
    }

    return data.secureUrl as string;
  };

  const handleDocumentFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!SUPPORTED_DOC_TYPES.includes(file.type)) {
      setFieldError("Only PDF, PNG, and JPG files are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFieldError("File size must be 2MB or less.");
      return;
    }
    setFieldError("");
    setIsUploadingDocument(true);
    try {
      const cloudinaryUrl = await uploadDocumentToCloudinary(file);
      setDocumentForm((prev) => ({
        ...prev,
        fileName: prev.fileName || file.name,
        fileUrl: cloudinaryUrl,
      }));
    } catch (error) {
      setFieldError(getErrorMessage(error));
    } finally {
      setIsUploadingDocument(false);
    }
  };

  const saveDocument = async () => {
    if (isUploadingDocument) {
      setFieldError("Please wait until file upload completes.");
      return;
    }
    if (!documentForm.fileName.trim() || !documentForm.fileUrl.trim()) {
      setFieldError("Document name and URL are required.");
      return;
    }
    if (!/^https?:\/\//i.test(documentForm.fileUrl.trim())) {
      setFieldError("Document URL must start with http:// or https://");
      return;
    }
    await runMutation(async () => {
      if (isEditingDocument && editingDocumentId) {
        await employeeApi.updateDocument(employeeId, editingDocumentId, documentForm);
      } else {
        await employeeApi.addDocument(employeeId, documentForm);
      }
      setDocumentOpen(false);
      setEditingDocumentId(null);
    }, `Document ${isEditingDocument ? "updated" : "added"} successfully.`);
  };

  const deleteDocument = async (documentId: string) => {
    if (!window.confirm("Delete this document?")) return;
    await runMutation(async () => {
      await employeeApi.deleteDocument(employeeId, String(documentId));
    }, "Document deleted successfully.");
  };

  const openAssetDialog = (asset?: Asset) => {
    setFieldError("");
    if (!asset) {
      setEditingAssetId(null);
      setAssetForm(emptyAssetForm);
    } else {
      setEditingAssetId(String(asset.id));
      setAssetForm({
        type: asset.type || "LAPTOP",
        serialNumber: asset.serialNumber || "",
        allocationDate: asset.allocationDate || "",
        notes: asset.notes || "",
      });
    }
    setAssetOpen(true);
  };

  const saveAsset = async () => {
    if (!assetForm.serialNumber.trim() || !assetForm.allocationDate.trim()) {
      setFieldError("Asset ID and assigned date are required.");
      return;
    }
    if (assetForm.allocationDate > todayDate) {
      setFieldError("Assigned date cannot be in the future.");
      return;
    }
    await runMutation(async () => {
      if (isEditingAsset && editingAssetId) {
        await employeeApi.updateAsset(employeeId, editingAssetId, assetForm);
      } else {
        await employeeApi.addAsset(employeeId, assetForm);
      }
      setAssetOpen(false);
      setEditingAssetId(null);
    }, `Asset ${isEditingAsset ? "updated" : "added"} successfully.`);
  };

  const deleteAsset = async (assetId: string) => {
    if (!window.confirm("Delete this asset?")) return;
    await runMutation(async () => {
      await employeeApi.deleteAsset(employeeId, String(assetId));
    }, "Asset deleted successfully.");
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Employee not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {notice && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              notice.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {notice.text}
          </div>
        )}

        {/* Back button */}
        <Link href="/employees" className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
          <ArrowLeft size={16} />
          Back to Employees
        </Link>

        {/* Profile Header */}
        <EmployeeProfileHeader
          employee={employee}
          onEdit={openPersonalDialog}
          onDelete={handleDeleteEmployee}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <div className="space-y-3 md:hidden">
            <Select
              aria-label="Select employee profile section"
              value={activeTab}
              onChange={(event) => handleTabChange(event.target.value)}
            >
              {TAB_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <TabsList className="hidden md:flex">
            {TAB_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value}>
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="overview">
            <OverviewTab employee={employee} />
          </TabsContent>

          <TabsContent value="personal">
            <PersonalDetailsTab personalDetails={employee.personalDetails} onEdit={openPersonalDialog} />
          </TabsContent>

          <TabsContent value="address">
            <AddressTab
              addresses={employee.addresses}
              onAdd={() => openAddressDialog()}
              onEdit={(item) => openAddressDialog(item)}
              onDelete={(addressId) => deleteAddress(String(addressId))}
            />
          </TabsContent>

          <TabsContent value="education">
            <EducationTab
              education={employee.education}
              onAdd={() => openEducationDialog()}
              onEdit={(item) => openEducationDialog(item)}
              onDelete={(recordId) => deleteEducation(String(recordId))}
            />
          </TabsContent>

          <TabsContent value="employment">
            <EmploymentTab
              employment={employee.employment}
              onAdd={() => openEmploymentDialog()}
              onEdit={(item) => openEmploymentDialog(item)}
              onDelete={(recordId) => deleteEmployment(String(recordId))}
            />
          </TabsContent>

          <TabsContent value="family">
            <FamilyTab
              family={employee.family}
              onAdd={() => openFamilyDialog()}
              onEdit={(member) => openFamilyDialog(member)}
              onDelete={(memberId) => deleteFamilyMember(String(memberId))}
            />
          </TabsContent>

          <TabsContent value="bank">
            <BankPFTab
              bankDetails={employee.bankDetails}
              pfDetails={employee.pfDetails}
              onEditBank={() => openBankDialog(employee.bankDetails)}
              onEditPF={() => openPFDialog(employee.pfDetails)}
            />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab
              documents={employee.documents}
              onUpload={() => openDocumentDialog()}
              onEdit={(doc) => openDocumentDialog(doc)}
              onDelete={(documentId) => deleteDocument(String(documentId))}
            />
          </TabsContent>

          <TabsContent value="assets">
            <AssetsTab
              assets={employee.assets}
              onAdd={() => openAssetDialog()}
              onEdit={(item) => openAssetDialog(item)}
              onDelete={(assetId) => deleteAsset(String(assetId))}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={personalOpen} onOpenChange={setPersonalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Personal Details</DialogTitle>
            <DialogDescription>Edit employee and personal information.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(100dvh-14rem)] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>First Name *</Label>
                <Input value={personalForm.firstName} onChange={(e) => setPersonalForm((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input value={personalForm.lastName} onChange={(e) => setPersonalForm((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={personalForm.email} onChange={(e) => setPersonalForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={personalForm.phone} onChange={(e) => setPersonalForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" max={todayDate} value={personalForm.dateOfBirth} onChange={(e) => setPersonalForm((p) => ({ ...p, dateOfBirth: e.target.value }))} />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={personalForm.gender} onChange={(e) => setPersonalForm((p) => ({ ...p, gender: e.target.value }))}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>
              <div>
                <Label>Marital Status</Label>
                <Select value={personalForm.maritalStatus} onChange={(e) => setPersonalForm((p) => ({ ...p, maritalStatus: e.target.value }))}>
                  <option value="SINGLE">Single</option>
                  <option value="MARRIED">Married</option>
                  <option value="DIVORCED">Divorced</option>
                  <option value="WIDOWED">Widowed</option>
                </Select>
              </div>
              <div>
                <Label>Blood Group</Label>
                <Input value={personalForm.bloodGroup} onChange={(e) => setPersonalForm((p) => ({ ...p, bloodGroup: e.target.value }))} />
              </div>
              <div>
                <Label>Nationality</Label>
                <Input value={personalForm.nationality} onChange={(e) => setPersonalForm((p) => ({ ...p, nationality: e.target.value }))} />
              </div>
              <div>
                <Label>Aadhaar Number</Label>
                <Input value={personalForm.aadharNumber} onChange={(e) => setPersonalForm((p) => ({ ...p, aadharNumber: e.target.value }))} />
              </div>
              <div>
                <Label>PAN Number</Label>
                <Input value={personalForm.panNumber} onChange={(e) => setPersonalForm((p) => ({ ...p, panNumber: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <Label>Passport Number</Label>
                <Input value={personalForm.passportNumber} onChange={(e) => setPersonalForm((p) => ({ ...p, passportNumber: e.target.value }))} />
              </div>
            </div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter className="flex-row flex-wrap justify-end">
            <Button size="sm" variant="outline" onClick={() => setPersonalOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button size="sm" onClick={savePersonalDetails} disabled={isSaving}>
              {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingAddress ? "Edit Address" : "Add Address"}</DialogTitle>
            <DialogDescription>Manage employee address information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Address Type</Label>
              <Select value={addressForm.type} onChange={(e) => setAddressForm((p) => ({ ...p, type: e.target.value as Address["type"] }))}>
                <option value="CURRENT">Current</option>
                <option value="PERMANENT">Permanent</option>
                <option value="EMERGENCY">Emergency</option>
              </Select>
            </div>
            <div>
              <Label>Street *</Label>
              <Input value={addressForm.street} onChange={(e) => setAddressForm((p) => ({ ...p, street: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City *</Label>
                <Input value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div>
                <Label>State *</Label>
                <Input value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Country *</Label>
                <Input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} />
              </div>
              <div>
                <Label>Pincode *</Label>
                <Input value={addressForm.zipCode} onChange={(e) => setAddressForm((p) => ({ ...p, zipCode: e.target.value }))} />
              </div>
            </div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={saveAddress} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={educationOpen} onOpenChange={setEducationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingEducation ? "Edit Education" : "Add Education"}</DialogTitle>
            <DialogDescription>Manage employee education records.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Degree *</Label><Input value={educationForm.degree} onChange={(e) => setEducationForm((p) => ({ ...p, degree: e.target.value }))} /></div>
            <div><Label>Institution *</Label><Input value={educationForm.school} onChange={(e) => setEducationForm((p) => ({ ...p, school: e.target.value }))} /></div>
            <div><Label>Field of Study *</Label><Input value={educationForm.fieldOfStudy} onChange={(e) => setEducationForm((p) => ({ ...p, fieldOfStudy: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Start Date *</Label><Input type="date" max={todayDate} value={educationForm.startDate} onChange={(e) => setEducationForm((p) => ({ ...p, startDate: e.target.value }))} /></div>
              <div><Label>End Date</Label><Input type="date" max={todayDate} value={educationForm.endDate} onChange={(e) => setEducationForm((p) => ({ ...p, endDate: e.target.value }))} /></div>
            </div>
            <div><Label>CGPA/Percentage</Label><Input value={educationForm.description} onChange={(e) => setEducationForm((p) => ({ ...p, description: e.target.value }))} /></div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEducationOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={saveEducation} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={employmentOpen} onOpenChange={setEmploymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingEmployment ? "Edit Employment" : "Add Employment"}</DialogTitle>
            <DialogDescription>Manage employee employment history. Adding a date of exit will mark the employee inactive.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[calc(100dvh-18rem)] overflow-y-auto pr-1">
            <div className="space-y-3">
              <div><Label>Company Name *</Label><Input value={employmentForm.companyName} onChange={(e) => setEmploymentForm((p) => ({ ...p, companyName: e.target.value }))} /></div>
              <div><Label>Job Title *</Label><Input value={employmentForm.jobTitle} onChange={(e) => setEmploymentForm((p) => ({ ...p, jobTitle: e.target.value }))} /></div>
              <div><Label>Work Location / Department *</Label><Input value={employmentForm.department} onChange={(e) => setEmploymentForm((p) => ({ ...p, department: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Start Date *</Label><Input type="date" max={todayDate} value={employmentForm.startDate} onChange={(e) => setEmploymentForm((p) => ({ ...p, startDate: e.target.value }))} /></div>
                <div><Label>Date of Exit</Label><Input type="date" max={todayDate} value={employmentForm.endDate} onChange={(e) => setEmploymentForm((p) => ({ ...p, endDate: e.target.value }))} /></div>
              </div>
              <div><Label>Employment Type</Label><Select value={employmentForm.employmentType} onChange={(e) => setEmploymentForm((p) => ({ ...p, employmentType: e.target.value }))}><option value="FULL_TIME">Full Time</option><option value="PART_TIME">Part Time</option><option value="CONTRACT">Contract</option><option value="INTERN">Intern</option></Select></div>
              <div><Label>Reporting Manager</Label><Input value={employmentForm.reportingManager} onChange={(e) => setEmploymentForm((p) => ({ ...p, reportingManager: e.target.value }))} /></div>
              <div><Label>Salary</Label><Input type="number" value={employmentForm.salary} onChange={(e) => setEmploymentForm((p) => ({ ...p, salary: e.target.value }))} /></div>
            </div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmploymentOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={saveEmployment} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={familyOpen} onOpenChange={setFamilyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingFamily ? "Edit Family Member" : "Add Family Member"}</DialogTitle>
            <DialogDescription>Manage employee family member details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Name *</Label><Input value={familyForm.name} onChange={(e) => setFamilyForm((p) => ({ ...p, name: e.target.value }))} /></div>
            <div><Label>Relation</Label><Select value={familyForm.relationship} onChange={(e) => setFamilyForm((p) => ({ ...p, relationship: e.target.value }))}><option value="SPOUSE">Spouse</option><option value="CHILD">Child</option><option value="PARENT">Parent</option><option value="SIBLING">Sibling</option><option value="OTHER">Other</option></Select></div>
            <div><Label>DOB *</Label><Input type="date" max={todayDate} value={familyForm.dateOfBirth} onChange={(e) => setFamilyForm((p) => ({ ...p, dateOfBirth: e.target.value }))} /></div>
            <div><Label>Contact Number</Label><Input value={familyForm.mobileNumber} onChange={(e) => setFamilyForm((p) => ({ ...p, mobileNumber: e.target.value }))} /></div>
            <div><Label>Dependent Status</Label><Select value={familyForm.dependentStatus} onChange={(e) => setFamilyForm((p) => ({ ...p, dependentStatus: e.target.value }))}><option value="DEPENDENT">Dependent</option><option value="NOT_DEPENDENT">Not Dependent</option></Select></div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFamilyOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={saveFamily} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bankOpen}
        onOpenChange={(open) => {
          setBankOpen(open);
          if (!open) {
            setShowBankSuggestions(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank Details</DialogTitle>
            <DialogDescription>Manage bank account details for salary processing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Account Holder Name *</Label><Input value={bankForm.accountHolderName} onChange={(e) => setBankForm((p) => ({ ...p, accountHolderName: e.target.value.replace(/[^A-Za-z ]/g, "") }))} /></div>
            <div className="relative">
              <Label>Bank Name *</Label>
              <Input
                value={bankForm.bankName}
                onFocus={() => setShowBankSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setShowBankSuggestions(false);
                  }, 100);
                }}
                onChange={(e) => {
                  setBankForm((p) => ({ ...p, bankName: e.target.value }));
                  setShowBankSuggestions(true);
                }}
                placeholder={isLoadingBankOptions ? "Loading bank names..." : "Type or select bank name"}
              />
              {showBankSuggestions && filteredBankOptions.length > 0 && (
                <div className="absolute z-20 mt-1 max-h-44 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  {filteredBankOptions.map((bankName) => (
                    <button
                      key={bankName}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        setBankForm((p) => ({ ...p, bankName }));
                        setShowBankSuggestions(false);
                      }}
                    >
                      {bankName}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Account Number *</Label>
              <Input
                inputMode="numeric"
                maxLength={expectedAccountDigits ?? 18}
                value={bankForm.accountNumber}
                onChange={(e) => {
                  const digitsOnly = e.target.value.replace(/\D/g, "");
                  const clamped = expectedAccountDigits
                    ? digitsOnly.slice(0, expectedAccountDigits)
                    : digitsOnly.slice(0, 18);
                  setBankForm((p) => ({ ...p, accountNumber: clamped }));
                }}
              />
              {expectedAccountDigits && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This bank allows exactly {expectedAccountDigits} digits.
                </p>
              )}
            </div>
            <div>
              <Label>IFSC Code *</Label>
              <div className="flex gap-2">
                <Input
                  maxLength={11}
                  value={bankForm.ifscCode}
                  onChange={(e) => {
                    const normalized = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    setBankForm((p) => ({ ...p, ifscCode: normalized, branchName: "" }));
                    setIfscLookupError("");
                    setLastIfscLookup("");
                  }}
                  onBlur={() => {
                    void lookupIfscDetails(false);
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 whitespace-nowrap"
                  onClick={() => {
                    void lookupIfscDetails(true);
                  }}
                  disabled={isFetchingIfsc || !bankForm.ifscCode.trim()}
                >
                  {isFetchingIfsc ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  <span className="ml-1">Fetch</span>
                </Button>
              </div>
            </div>
            <div><Label>Branch Name</Label><Input value={bankForm.branchName} onChange={(e) => setBankForm((p) => ({ ...p, branchName: e.target.value }))} /></div>
            <div><Label>Account Type</Label><Select value={bankForm.accountType} onChange={(e) => setBankForm((p) => ({ ...p, accountType: e.target.value }))}><option value="SAVINGS">Savings</option><option value="CURRENT">Current</option></Select></div>
            {isFetchingIfsc && <p className="text-sm text-blue-600">Fetching bank and branch from IFSC...</p>}
            {ifscLookupError && <p className="text-sm text-red-600">{ifscLookupError}</p>}
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            {employee.bankDetails && <Button variant="destructive" onClick={deleteBankDetails} disabled={isSaving}>Delete</Button>}
            <Button variant="outline" onClick={() => setBankOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={saveBankDetails} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={pfOpen} onOpenChange={setPfOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>PF Details</DialogTitle>
            <DialogDescription>Manage employee provident fund information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>UAN Number *</Label><Input inputMode="numeric" maxLength={12} value={pfForm.uan} onChange={(e) => setPfForm((p) => ({ ...p, uan: e.target.value.replace(/\D/g, "") }))} /></div>
            <div><Label>PF Number *</Label><Input value={pfForm.pfNumber} onChange={(e) => setPfForm((p) => ({ ...p, pfNumber: e.target.value }))} /></div>
            <div><Label>PF Joining Date *</Label><Input type="date" max={todayDate} value={pfForm.pfJoiningDate} onChange={(e) => setPfForm((p) => ({ ...p, pfJoiningDate: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Employee Contribution</Label><Input type="number" value={pfForm.employeeContribution} onChange={(e) => setPfForm((p) => ({ ...p, employeeContribution: e.target.value }))} /></div>
              <div><Label>Employer Contribution</Label><Input type="number" value={pfForm.employerContribution} onChange={(e) => setPfForm((p) => ({ ...p, employerContribution: e.target.value }))} /></div>
            </div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            {employee.pfDetails && <Button variant="destructive" onClick={deletePFDetails} disabled={isSaving}>Delete</Button>}
            <Button variant="outline" onClick={() => setPfOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={savePFDetails} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={documentOpen} onOpenChange={setDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingDocument ? "Edit Document" : "Add Document"}</DialogTitle>
            <DialogDescription>Upload validation supports PDF/PNG/JPG up to 2MB.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Document Type</Label><Select value={documentForm.type} onChange={(e) => setDocumentForm((p) => ({ ...p, type: e.target.value }))}><option value="AADHAAR">Aadhaar</option><option value="PAN">PAN</option><option value="PASSPORT">Passport</option><option value="LICENSE">License</option><option value="VISA">Visa</option><option value="OTHER">Other</option></Select></div>
            <div>
              <Label>Upload File</Label>
              <Input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleDocumentFileSelected} disabled={isUploadingDocument || isSaving} />
              {isUploadingDocument && <p className="text-sm text-blue-600 mt-1">Uploading to Cloudinary...</p>}
            </div>
            <div><Label>Document Name *</Label><Input value={documentForm.fileName} onChange={(e) => setDocumentForm((p) => ({ ...p, fileName: e.target.value }))} /></div>
            <div><Label>Document URL *</Label><Input value={documentForm.fileUrl} onChange={(e) => setDocumentForm((p) => ({ ...p, fileUrl: e.target.value }))} placeholder="https://..." disabled={isUploadingDocument} /></div>
            <div><Label>Expiry Date</Label><Input type="date" value={documentForm.expiryDate} onChange={(e) => setDocumentForm((p) => ({ ...p, expiryDate: e.target.value }))} /></div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentOpen(false)} disabled={isSaving || isUploadingDocument}>Cancel</Button>
            <Button onClick={saveDocument} disabled={isSaving || isUploadingDocument}>{(isSaving || isUploadingDocument) && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assetOpen} onOpenChange={setAssetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditingAsset ? "Edit Asset" : "Add Asset"}</DialogTitle>
            <DialogDescription>Manage company assets assigned to this employee.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>Asset Name</Label><Select value={assetForm.type} onChange={(e) => setAssetForm((p) => ({ ...p, type: e.target.value }))}><option value="LAPTOP">Laptop</option><option value="MOBILE">Mobile</option><option value="TABLET">Tablet</option><option value="ID_CARD">ID Card</option><option value="ACCESS_CARD">Access Card</option><option value="OTHER">Other</option></Select></div>
            <div><Label>Asset ID *</Label><Input value={assetForm.serialNumber} onChange={(e) => setAssetForm((p) => ({ ...p, serialNumber: e.target.value }))} /></div>
            <div><Label>Assigned Date *</Label><Input type="date" max={todayDate} value={assetForm.allocationDate} onChange={(e) => setAssetForm((p) => ({ ...p, allocationDate: e.target.value }))} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={assetForm.notes} onChange={(e) => setAssetForm((p) => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          {fieldError && <FormError>{fieldError}</FormError>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssetOpen(false)} disabled={isSaving}>Cancel</Button>
            <Button onClick={saveAsset} disabled={isSaving}>{isSaving && <Loader2 size={16} className="animate-spin mr-2" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
