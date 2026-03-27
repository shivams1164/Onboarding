import axios, { AxiosInstance, AxiosError } from "axios";
import {
  Address,
  ApiResponse,
  Asset,
  BankDetails,
  Document,
  Education,
  Employee,
  Employment,
  FamilyMember,
  PaginatedResponse,
  PFDetails,
  PersonalDetails,
} from "@/types/employee";

type ObjectPayload = Record<string, unknown>;
type EmployeeListPayload = Employee[] | PaginatedResponse<Employee>;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const message =
      typeof responseData === "object" && responseData !== null && "message" in responseData
        ? String((responseData as { message?: unknown }).message ?? "")
        : "";

    // Missing nested employee resources can be a valid empty-state scenario.
    if ((status === 400 || status === 404) && /not found/i.test(message)) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error("API Error:", errorMessage);
    return Promise.reject(error);
  }
);

// Employee API endpoints

export const employeeApi = {
  // GET all employees with pagination
  getAll: async (page: number = 0, size: number = 10, search?: string) => {
    const params = { page, size };
    if (search) {
      Object.assign(params, { search });
    }
    return apiClient.get<ApiResponse<EmployeeListPayload>>("/employees", { params });
  },

  // GET single employee by ID
  getById: async (id: string) => {
    return apiClient.get<ApiResponse<Employee>>(`/employees/${id}`);
  },

  // CREATE new employee
  create: async (data: ObjectPayload) => {
    return apiClient.post<ApiResponse<Employee>>("/employees", data);
  },

  // UPDATE employee
  update: async (id: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data);
  },

  // DELETE employee
  delete: async (id: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${id}`);
  },

  // Nested resource endpoints for related data

  // Personal Details
  getPersonalDetails: async (employeeId: string) => {
    return apiClient.get<ApiResponse<PersonalDetails | null>>(`/employees/${employeeId}/personal-details`);
  },

  updatePersonalDetails: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<PersonalDetails>>(`/employees/${employeeId}/personal-details`, data);
  },

  deletePersonalDetails: async (employeeId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/personal-details`);
  },

  // Addresses
  getAddresses: async (employeeId: string) => {
    return apiClient.get<ApiResponse<Address[]>>(`/employees/${employeeId}/addresses`);
  },

  addAddress: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.post<ApiResponse<Address>>(`/employees/${employeeId}/addresses`, data);
  },

  updateAddress: async (employeeId: string, addressId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<Address>>(`/employees/${employeeId}/addresses/${addressId}`, data);
  },

  deleteAddress: async (employeeId: string, addressId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/addresses/${addressId}`);
  },

  // Education
  getEducation: async (employeeId: string) => {
    return apiClient.get<ApiResponse<Education[]>>(`/employees/${employeeId}/education`);
  },

  addEducation: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.post<ApiResponse<Education>>(`/employees/${employeeId}/education`, data);
  },

  updateEducation: async (employeeId: string, educationId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<Education>>(`/employees/${employeeId}/education/${educationId}`, data);
  },

  deleteEducation: async (employeeId: string, educationId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/education/${educationId}`);
  },

  // Employment
  getEmployment: async (employeeId: string) => {
    return apiClient.get<ApiResponse<Employment[]>>(`/employees/${employeeId}/employment`);
  },

  addEmployment: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.post<ApiResponse<Employment>>(`/employees/${employeeId}/employment`, data);
  },

  updateEmployment: async (employeeId: string, employmentId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<Employment>>(`/employees/${employeeId}/employment/${employmentId}`, data);
  },

  deleteEmployment: async (employeeId: string, employmentId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/employment/${employmentId}`);
  },

  // Family
  getFamily: async (employeeId: string) => {
    return apiClient.get<ApiResponse<FamilyMember[]>>(`/employees/${employeeId}/family`);
  },

  addFamilyMember: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.post<ApiResponse<FamilyMember>>(`/employees/${employeeId}/family`, data);
  },

  updateFamilyMember: async (employeeId: string, memberId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<FamilyMember>>(`/employees/${employeeId}/family/${memberId}`, data);
  },

  deleteFamilyMember: async (employeeId: string, memberId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/family/${memberId}`);
  },

  // Bank Details
  getBankDetails: async (employeeId: string) => {
    return apiClient.get<ApiResponse<BankDetails | null>>(`/employees/${employeeId}/bank-details`);
  },

  updateBankDetails: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<BankDetails>>(`/employees/${employeeId}/bank-details`, data);
  },

  deleteBankDetails: async (employeeId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/bank-details`);
  },

  // PF Details
  getPFDetails: async (employeeId: string) => {
    return apiClient.get<ApiResponse<PFDetails | null>>(`/employees/${employeeId}/pf-details`);
  },

  updatePFDetails: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<PFDetails>>(`/employees/${employeeId}/pf-details`, data);
  },

  deletePFDetails: async (employeeId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/pf-details`);
  },

  // Documents
  getDocuments: async (employeeId: string) => {
    return apiClient.get<ApiResponse<Document[]>>(`/employees/${employeeId}/documents`);
  },

  uploadDocument: async (employeeId: string, data: FormData) => {
    return apiClient.post<ApiResponse<Document>>(`/employees/${employeeId}/documents`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  addDocument: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.post<ApiResponse<Document>>(`/employees/${employeeId}/documents`, data);
  },

  updateDocument: async (employeeId: string, documentId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<Document>>(`/employees/${employeeId}/documents/${documentId}`, data);
  },

  deleteDocument: async (employeeId: string, documentId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/documents/${documentId}`);
  },

  // Assets
  getAssets: async (employeeId: string) => {
    return apiClient.get<ApiResponse<Asset[]>>(`/employees/${employeeId}/assets`);
  },

  addAsset: async (employeeId: string, data: ObjectPayload) => {
    return apiClient.post<ApiResponse<Asset>>(`/employees/${employeeId}/assets`, data);
  },

  updateAsset: async (employeeId: string, assetId: string, data: ObjectPayload) => {
    return apiClient.put<ApiResponse<Asset>>(`/employees/${employeeId}/assets/${assetId}`, data);
  },

  deleteAsset: async (employeeId: string, assetId: string) => {
    return apiClient.delete<ApiResponse<void>>(`/employees/${employeeId}/assets/${assetId}`);
  },
};

export default apiClient;
