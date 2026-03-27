// Add/Edit employee form page with multi-step stepper
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FormField, FormError } from "@/components/ui/FormElements";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEmployeeSchema } from "@/lib/schemas";
import type { CreateEmployeeFormData } from "@/lib/schemas";
import { employeeApi } from "@/lib/api";
import { ChevronLeft, ChevronRight, Save, FileText } from "lucide-react";

const steps = [
  { id: 1, title: "Basic Info", description: "Name, Email, Phone" },
  { id: 2, title: "Employee Details", description: "ID, Designation, Department" },
  { id: 3, title: "Employment", description: "Joining Date, Status" },
  { id: 4, title: "Review", description: "Confirm details" },
];

export default function AddEmployeePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    trigger,
  } = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(CreateEmployeeSchema),
    mode: "onChange",
  });

  const formData = watch();

  const onSubmit = async (data: CreateEmployeeFormData) => {
    try {
      setIsSaving(true);
      await employeeApi.create(data);
      router.push("/employees");
    } catch (error) {
      console.error("Failed to create employee:", error);
      alert("Failed to create employee. Please check the form and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const validateCurrentStep = async () => {
    const stepFields: Record<number, Array<keyof CreateEmployeeFormData>> = {
      1: ["firstName", "lastName", "email", "phone"],
      2: ["employeeId", "designation", "department"],
      3: ["dateOfJoining", "status"],
      4: [],
    };

    const fields = stepFields[currentStep] || [];
    if (fields.length === 0) {
      return true;
    }

    return trigger(fields);
  };

  const isStepComplete = (stepNum: number) => {
    const data = getValues();
    switch (stepNum) {
      case 1:
        return !!(data.firstName && data.lastName && data.email && data.phone && !errors.firstName && !errors.lastName && !errors.email && !errors.phone);
      case 2:
        return !!(data.employeeId && data.designation && data.department && !errors.employeeId && !errors.designation && !errors.department);
      case 3:
        return !!(data.dateOfJoining && data.status && !errors.dateOfJoining && !errors.status);
      default:
        return true;
    }
  };

  const canProceed = isStepComplete(currentStep);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
          <p className="text-gray-600 mt-1">Complete the form to create a new employee</p>
        </div>

        {/* Stepper */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  {/* Step circle */}
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                      currentStep === step.id
                        ? "bg-blue-600 text-white"
                        : isStepComplete(step.id)
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isStepComplete(step.id) && currentStep !== step.id ? "✓" : step.id}
                  </button>

                  {/* Step info */}
                  <div className="ml-3 hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 md:mx-4 ${
                        isStepComplete(step.id) ? "bg-green-200" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <>
                    <FormField>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        placeholder="Enter first name"
                        {...register("firstName")}
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <FormError>{errors.firstName.message}</FormError>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        {...register("lastName")}
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <FormError>{errors.lastName.message}</FormError>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter work email"
                        {...register("email")}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <FormError>{errors.email.message}</FormError>}
                    </FormField>

                    <FormField>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        {...register("phone")}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <FormError>{errors.phone.message}</FormError>}
                    </FormField>
                  </>
                )}

                {/* Step 2: Employee Details */}
                {currentStep === 2 && (
                  <>
                    <FormField>
                      <Label htmlFor="employeeId">Employee ID *</Label>
                      <Input
                        id="employeeId"
                        placeholder="Enter employee ID"
                        {...register("employeeId")}
                        className={errors.employeeId ? "border-red-500" : ""}
                      />
                      {errors.employeeId && (
                        <FormError>{errors.employeeId.message}</FormError>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="designation">Designation *</Label>
                      <Input
                        id="designation"
                        placeholder="Engineer"
                        {...register("designation")}
                        className={errors.designation ? "border-red-500" : ""}
                      />
                      {errors.designation && (
                        <FormError>{errors.designation.message}</FormError>
                      )}
                    </FormField>

                    <FormField className="md:col-span-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select
                        id="department"
                        {...register("department")}
                        className={errors.department ? "border-red-500" : ""}
                      >
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="HR">HR</option>
                        <option value="Sales">Sales</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                      </Select>
                      {errors.department && (
                        <FormError>{errors.department.message}</FormError>
                      )}
                    </FormField>
                  </>
                )}

                {/* Step 3: Employment */}
                {currentStep === 3 && (
                  <>
                    <FormField>
                      <Label htmlFor="dateOfJoining">Date of Joining *</Label>
                      <Input
                        id="dateOfJoining"
                        type="date"
                        {...register("dateOfJoining")}
                        className={errors.dateOfJoining ? "border-red-500" : ""}
                      />
                      {errors.dateOfJoining && (
                        <FormError>{errors.dateOfJoining.message}</FormError>
                      )}
                    </FormField>

                    <FormField>
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        id="status"
                        {...register("status")}
                        className={errors.status ? "border-red-500" : ""}
                      >
                        <option value="">Select Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </Select>
                      {errors.status && <FormError>{errors.status.message}</FormError>}
                    </FormField>
                  </>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="md:col-span-2">
                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900">Review Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Name</p>
                          <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Email</p>
                          <p className="font-medium">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Employee ID</p>
                          <p className="font-medium">{formData.employeeId}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Designation</p>
                          <p className="font-medium">{formData.designation}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Department</p>
                          <p className="font-medium">{formData.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className="font-medium">{formData.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="gap-2"
            >
              <FileText size={16} />
              Save as Draft
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={async () => {
                  const isValid = await validateCurrentStep();
                  if (!isValid) {
                    return;
                  }
                  setCurrentStep(Math.min(4, currentStep + 1));
                }}
                disabled={!canProceed}
                className="gap-2"
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSaving}
                isLoading={isSaving}
                className="gap-2"
              >
                <Save size={16} />
                Create Employee
              </Button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}
