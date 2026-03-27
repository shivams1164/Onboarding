import { z } from "zod";

// Zod Schemas for validation

export const EmployeeStatusSchema = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]);

export const PersonalDetailsSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  bloodGroup: z.string().optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]),
  nationality: z.string().min(2, "Nationality is required"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar must be 12 digits").optional().or(z.literal("")),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").optional().or(z.literal("")),
  passportNumber: z.string().optional(),
});

export const AddressSchema = z.object({
  type: z.enum(["PERMANENT", "CURRENT", "EMERGENCY"]),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zipCode: z.string().regex(/^\d{6}$/, "ZIP code must be 6 digits"),
  isPrimary: z.boolean(),
});

export const EducationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  school: z.string().min(2, "School/University is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().optional(),
  certificateUrl: z.string().url().optional().or(z.literal("")),
});

export const EmploymentSchema = z.object({
  jobTitle: z.string().min(2, "Job title is required"),
  department: z.string().min(2, "Department is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  isCurrentJob: z.boolean(),
  reportingManager: z.string().optional(),
  salary: z.number().positive().optional(),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN"]),
});

export const FamilyMemberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  relationship: z.enum(["SPOUSE", "CHILD", "PARENT", "SIBLING", "OTHER"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits").optional().or(z.literal("")),
  dependentStatus: z.enum(["DEPENDENT", "NOT_DEPENDENT"]).optional(),
});

export const BankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, "Account holder name is required"),
  accountNumber: z.string().regex(/^\d{10,18}$/, "Invalid account number"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  bankName: z.string().min(2, "Bank name is required"),
  branchName: z.string().min(2, "Branch name is required"),
  accountType: z.enum(["SAVINGS", "CURRENT"]),
});

export const PFDetailsSchema = z.object({
  uan: z.string().regex(/^\d{12}$/, "UAN must be 12 digits"),
  pfNumber: z.string().min(5, "PF number is required"),
  pfJoiningDate: z.string().min(1, "PF joining date is required"),
  employeeContribution: z.number().nonnegative(),
  employerContribution: z.number().nonnegative(),
});

export const DocumentSchema = z.object({
  type: z.enum(["AADHAAR", "PAN", "PASSPORT", "LICENSE", "VISA", "OTHER"]),
  fileName: z.string().min(1, "File name is required"),
  fileUrl: z.string().url("Invalid file URL"),
  expiryDate: z.string().optional(),
  uploadedAt: z.string(),
});

export const AssetSchema = z.object({
  type: z.enum(["LAPTOP", "MOBILE", "TABLET", "ID_CARD", "ACCESS_CARD", "OTHER"]),
  serialNumber: z.string().min(2, "Serial number is required"),
  allocationDate: z.string().min(1, "Allocation date is required"),
  notes: z.string().optional(),
});

// Main Employee Create/Update schemas

export const CreateEmployeeSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  employeeId: z.string().min(3, "Employee ID is required"),
  designation: z.string().min(2, "Designation is required"),
  department: z.string().min(2, "Department is required"),
  dateOfJoining: z.string().min(1, "Date of joining is required"),
  status: EmployeeStatusSchema,
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export type CreateEmployeeFormData = z.infer<typeof CreateEmployeeSchema>;
export type PersonalDetailsFormData = z.infer<typeof PersonalDetailsSchema>;
export type AddressFormData = z.infer<typeof AddressSchema>;
export type EducationFormData = z.infer<typeof EducationSchema>;
export type EmploymentFormData = z.infer<typeof EmploymentSchema>;
export type FamilyMemberFormData = z.infer<typeof FamilyMemberSchema>;
export type BankDetailsFormData = z.infer<typeof BankDetailsSchema>;
export type PFDetailsFormData = z.infer<typeof PFDetailsSchema>;
