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
import { ChevronLeft, ChevronRight, Save } from "lucide-react";

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
  const todayDate = new Date().toISOString().split("T")[0];

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
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Add New Employee</h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">Complete the form to create a new employee</p>
        </div>

        {/* Stepper */}
        <Card className="overflow-hidden">
          <CardContent className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-blue-600">Step {currentStep} of {steps.length}</p>
                <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">{steps[currentStep - 1].title}</h2>
                <p className="mt-1 text-sm text-gray-600">{steps[currentStep - 1].description}</p>
              </div>
              <p className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200">
                {progressPercent}%
              </p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {steps.map((step) => {
                const completed = isStepComplete(step.id);
                const isActive = currentStep === step.id;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    aria-current={isActive ? "step" : undefined}
                    className={`flex min-h-11 items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive
                        ? "border-blue-600 bg-blue-50 shadow-sm dark:border-blue-500 dark:bg-blue-950/30"
                        : completed
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                        : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : completed
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {completed && !isActive ? "✓" : step.id}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{step.title}</span>
                      <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">{step.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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
                        max={todayDate}
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
          <div className="sticky bottom-0 z-10 -mx-4 border-t border-gray-200 bg-gray-50/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-gray-700 dark:bg-gray-950/95">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="w-full gap-2 sm:w-auto"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
                    className="w-full gap-2 sm:w-auto"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSaving}
                    isLoading={isSaving}
                    className="w-full gap-2 sm:w-auto"
                  >
                    <Save size={16} />
                    Create Employee
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
