// Employee Domain Types

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  status: EmployeeStatus;
  profilePhotoUrl?: string;
  personalDetails?: PersonalDetails;
  addresses?: Address[];
  education?: Education[];
  employment?: Employment[];
  family?: FamilyMember[];
  bankDetails?: BankDetails;
  pfDetails?: PFDetails;
  documents?: Document[];
  assets?: Asset[];
}

export interface PersonalDetails {
  id: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  bloodGroup?: string;
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  nationality: string;
  aadharNumber?: string;
  panNumber?: string;
  passportNumber?: string;
}

export interface Address {
  id: string;
  type: "PERMANENT" | "CURRENT" | "EMERGENCY";
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isPrimary: boolean;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  school: string;
  startDate: string;
  endDate: string;
  description?: string;
  certificateUrl?: string;
}

export interface Employment {
  id: string;
  jobTitle: string;
  department: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  reportingManager?: string;
  salary?: number;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: "SPOUSE" | "CHILD" | "PARENT" | "SIBLING" | "OTHER";
  dateOfBirth: string;
  mobileNumber?: string;
  dependentStatus?: "DEPENDENT" | "NOT_DEPENDENT";
}

export interface BankDetails {
  id: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: "SAVINGS" | "CURRENT";
}

export interface PFDetails {
  id: string;
  uan: string;
  pfNumber: string;
  pfJoiningDate: string;
  employeeContribution: number;
  employerContribution: number;
}

export interface Document {
  id: string;
  type: "AADHAAR" | "PAN" | "PASSPORT" | "LICENSE" | "VISA" | "OTHER";
  fileName: string;
  fileUrl: string;
  expiryDate?: string;
  uploadedAt: string;
}

export interface Asset {
  id: string;
  type: "LAPTOP" | "MOBILE" | "TABLET" | "ID_CARD" | "ACCESS_CARD" | "OTHER";
  serialNumber: string;
  allocationDate: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
