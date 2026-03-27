package com.hrms.controller;

import com.hrms.dto.*;
import com.hrms.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeeController {

    private final EmployeeService employeeService;

    // Employee CRUD Endpoints
    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeDTO>> createEmployee(@RequestBody CreateEmployeeDTO dto) {
        EmployeeDTO employee = employeeService.createEmployee(dto);
        return ResponseEntity.ok(
                ApiResponse.<EmployeeDTO>builder()
                        .success(true)
                        .message("Employee created successfully")
                        .data(employee)
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> getEmployee(@PathVariable Long id) {
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(
                ApiResponse.<EmployeeDTO>builder()
                        .success(true)
                        .message("Employee fetched successfully")
                        .data(employee)
                        .build()
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeDTO>>> getAllEmployees() {
        List<EmployeeDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(
                ApiResponse.<List<EmployeeDTO>>builder()
                        .success(true)
                        .message("Employees fetched successfully")
                        .data(employees)
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeDTO>> updateEmployee(@PathVariable Long id, @RequestBody CreateEmployeeDTO dto) {
        EmployeeDTO employee = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(
                ApiResponse.<EmployeeDTO>builder()
                        .success(true)
                        .message("Employee updated successfully")
                        .data(employee)
                        .build()
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Employee deleted successfully")
                        .build()
        );
    }

    // Personal Details Endpoints
    @GetMapping("/{employeeId}/personal-details")
    public ResponseEntity<ApiResponse<PersonalDetailsDTO>> getPersonalDetails(@PathVariable Long employeeId) {
        PersonalDetailsDTO details = employeeService.getPersonalDetails(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<PersonalDetailsDTO>builder()
                        .success(true)
                        .message("Personal details fetched successfully")
                        .data(details)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/personal-details")
    public ResponseEntity<ApiResponse<PersonalDetailsDTO>> updatePersonalDetails(@PathVariable Long employeeId, @RequestBody PersonalDetailsDTO dto) {
        PersonalDetailsDTO details = employeeService.updatePersonalDetails(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<PersonalDetailsDTO>builder()
                        .success(true)
                        .message("Personal details updated successfully")
                        .data(details)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/personal-details")
    public ResponseEntity<ApiResponse<Void>> deletePersonalDetails(@PathVariable Long employeeId) {
        employeeService.deletePersonalDetails(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Personal details deleted successfully")
                        .build()
        );
    }

    // Address Endpoints
    @GetMapping("/{employeeId}/addresses")
    public ResponseEntity<ApiResponse<List<AddressDTO>>> getAddresses(@PathVariable Long employeeId) {
        List<AddressDTO> addresses = employeeService.getAddresses(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<List<AddressDTO>>builder()
                        .success(true)
                        .message("Addresses fetched successfully")
                        .data(addresses)
                        .build()
        );
    }

    @PostMapping("/{employeeId}/addresses")
    public ResponseEntity<ApiResponse<AddressDTO>> addAddress(@PathVariable Long employeeId, @RequestBody AddressDTO dto) {
        AddressDTO address = employeeService.addAddress(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<AddressDTO>builder()
                        .success(true)
                        .message("Address added successfully")
                        .data(address)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/addresses/{addressId}")
    public ResponseEntity<ApiResponse<AddressDTO>> updateAddress(@PathVariable Long employeeId, @PathVariable Long addressId, @RequestBody AddressDTO dto) {
        AddressDTO address = employeeService.updateAddress(employeeId, addressId, dto);
        return ResponseEntity.ok(
                ApiResponse.<AddressDTO>builder()
                        .success(true)
                        .message("Address updated successfully")
                        .data(address)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable Long employeeId, @PathVariable Long addressId) {
        employeeService.deleteAddress(addressId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Address deleted successfully")
                        .build()
        );
    }

    // Education Endpoints
    @GetMapping("/{employeeId}/education")
    public ResponseEntity<ApiResponse<List<EducationDTO>>> getEducation(@PathVariable Long employeeId) {
        List<EducationDTO> education = employeeService.getEducation(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<List<EducationDTO>>builder()
                        .success(true)
                        .message("Education records fetched successfully")
                        .data(education)
                        .build()
        );
    }

    @PostMapping("/{employeeId}/education")
    public ResponseEntity<ApiResponse<EducationDTO>> addEducation(@PathVariable Long employeeId, @RequestBody EducationDTO dto) {
        EducationDTO education = employeeService.addEducation(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<EducationDTO>builder()
                        .success(true)
                        .message("Education added successfully")
                        .data(education)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/education/{educationId}")
    public ResponseEntity<ApiResponse<EducationDTO>> updateEducation(@PathVariable Long employeeId, @PathVariable Long educationId, @RequestBody EducationDTO dto) {
        EducationDTO education = employeeService.updateEducation(employeeId, educationId, dto);
        return ResponseEntity.ok(
                ApiResponse.<EducationDTO>builder()
                        .success(true)
                        .message("Education updated successfully")
                        .data(education)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/education/{educationId}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(@PathVariable Long employeeId, @PathVariable Long educationId) {
        employeeService.deleteEducation(educationId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Education deleted successfully")
                        .build()
        );
    }

    // Employment Endpoints
    @GetMapping("/{employeeId}/employment")
    public ResponseEntity<ApiResponse<List<EmploymentDTO>>> getEmployment(@PathVariable Long employeeId) {
        List<EmploymentDTO> employment = employeeService.getEmployment(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<List<EmploymentDTO>>builder()
                        .success(true)
                        .message("Employment records fetched successfully")
                        .data(employment)
                        .build()
        );
    }

    @PostMapping("/{employeeId}/employment")
    public ResponseEntity<ApiResponse<EmploymentDTO>> addEmployment(@PathVariable Long employeeId, @RequestBody EmploymentDTO dto) {
        EmploymentDTO employment = employeeService.addEmployment(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<EmploymentDTO>builder()
                        .success(true)
                        .message("Employment added successfully")
                        .data(employment)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/employment/{employmentId}")
    public ResponseEntity<ApiResponse<EmploymentDTO>> updateEmployment(@PathVariable Long employeeId, @PathVariable Long employmentId, @RequestBody EmploymentDTO dto) {
        EmploymentDTO employment = employeeService.updateEmployment(employeeId, employmentId, dto);
        return ResponseEntity.ok(
                ApiResponse.<EmploymentDTO>builder()
                        .success(true)
                        .message("Employment updated successfully")
                        .data(employment)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/employment/{employmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployment(@PathVariable Long employeeId, @PathVariable Long employmentId) {
        employeeService.deleteEmployment(employmentId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Employment deleted successfully")
                        .build()
        );
    }

    // Family Endpoints
    @GetMapping("/{employeeId}/family")
    public ResponseEntity<ApiResponse<List<FamilyMemberDTO>>> getFamily(@PathVariable Long employeeId) {
        List<FamilyMemberDTO> family = employeeService.getFamily(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<List<FamilyMemberDTO>>builder()
                        .success(true)
                        .message("Family records fetched successfully")
                        .data(family)
                        .build()
        );
    }

    @PostMapping("/{employeeId}/family")
    public ResponseEntity<ApiResponse<FamilyMemberDTO>> addFamilyMember(@PathVariable Long employeeId, @RequestBody FamilyMemberDTO dto) {
        FamilyMemberDTO member = employeeService.addFamilyMember(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<FamilyMemberDTO>builder()
                        .success(true)
                        .message("Family member added successfully")
                        .data(member)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/family/{memberId}")
    public ResponseEntity<ApiResponse<FamilyMemberDTO>> updateFamilyMember(@PathVariable Long employeeId, @PathVariable Long memberId, @RequestBody FamilyMemberDTO dto) {
        FamilyMemberDTO member = employeeService.updateFamilyMember(employeeId, memberId, dto);
        return ResponseEntity.ok(
                ApiResponse.<FamilyMemberDTO>builder()
                        .success(true)
                        .message("Family member updated successfully")
                        .data(member)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/family/{memberId}")
    public ResponseEntity<ApiResponse<Void>> deleteFamilyMember(@PathVariable Long employeeId, @PathVariable Long memberId) {
        employeeService.deleteFamilyMember(memberId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Family member deleted successfully")
                        .build()
        );
    }

    // Bank Details Endpoints
    @GetMapping("/{employeeId}/bank-details")
    public ResponseEntity<ApiResponse<BankDetailsDTO>> getBankDetails(@PathVariable Long employeeId) {
        BankDetailsDTO details = employeeService.getBankDetails(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<BankDetailsDTO>builder()
                        .success(true)
                        .message("Bank details fetched successfully")
                        .data(details)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/bank-details")
    public ResponseEntity<ApiResponse<BankDetailsDTO>> updateBankDetails(@PathVariable Long employeeId, @RequestBody BankDetailsDTO dto) {
        BankDetailsDTO details = employeeService.updateBankDetails(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<BankDetailsDTO>builder()
                        .success(true)
                        .message("Bank details updated successfully")
                        .data(details)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/bank-details")
    public ResponseEntity<ApiResponse<Void>> deleteBankDetails(@PathVariable Long employeeId) {
        employeeService.deleteBankDetails(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Bank details deleted successfully")
                        .build()
        );
    }

    // PF Details Endpoints
    @GetMapping("/{employeeId}/pf-details")
    public ResponseEntity<ApiResponse<PFDetailsDTO>> getPFDetails(@PathVariable Long employeeId) {
        PFDetailsDTO details = employeeService.getPFDetails(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<PFDetailsDTO>builder()
                        .success(true)
                        .message("PF details fetched successfully")
                        .data(details)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/pf-details")
    public ResponseEntity<ApiResponse<PFDetailsDTO>> updatePFDetails(@PathVariable Long employeeId, @RequestBody PFDetailsDTO dto) {
        PFDetailsDTO details = employeeService.updatePFDetails(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<PFDetailsDTO>builder()
                        .success(true)
                        .message("PF details updated successfully")
                        .data(details)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/pf-details")
    public ResponseEntity<ApiResponse<Void>> deletePFDetails(@PathVariable Long employeeId) {
        employeeService.deletePFDetails(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("PF details deleted successfully")
                        .build()
        );
    }

    // Documents Endpoints
    @GetMapping("/{employeeId}/documents")
    public ResponseEntity<ApiResponse<List<DocumentDTO>>> getDocuments(@PathVariable Long employeeId) {
        List<DocumentDTO> documents = employeeService.getDocuments(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<List<DocumentDTO>>builder()
                        .success(true)
                        .message("Documents fetched successfully")
                        .data(documents)
                        .build()
        );
    }

    @PostMapping("/{employeeId}/documents")
    public ResponseEntity<ApiResponse<DocumentDTO>> addDocument(@PathVariable Long employeeId, @RequestBody DocumentDTO dto) {
        DocumentDTO document = employeeService.addDocument(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<DocumentDTO>builder()
                        .success(true)
                        .message("Document added successfully")
                        .data(document)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/documents/{documentId}")
    public ResponseEntity<ApiResponse<DocumentDTO>> updateDocument(@PathVariable Long employeeId, @PathVariable Long documentId, @RequestBody DocumentDTO dto) {
        DocumentDTO document = employeeService.updateDocument(employeeId, documentId, dto);
        return ResponseEntity.ok(
                ApiResponse.<DocumentDTO>builder()
                        .success(true)
                        .message("Document updated successfully")
                        .data(document)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/documents/{documentId}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long employeeId, @PathVariable Long documentId) {
        employeeService.deleteDocument(documentId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Document deleted successfully")
                        .build()
        );
    }

    // Assets Endpoints
    @GetMapping("/{employeeId}/assets")
    public ResponseEntity<ApiResponse<List<AssetDTO>>> getAssets(@PathVariable Long employeeId) {
        List<AssetDTO> assets = employeeService.getAssets(employeeId);
        return ResponseEntity.ok(
                ApiResponse.<List<AssetDTO>>builder()
                        .success(true)
                        .message("Assets fetched successfully")
                        .data(assets)
                        .build()
        );
    }

    @PostMapping("/{employeeId}/assets")
    public ResponseEntity<ApiResponse<AssetDTO>> addAsset(@PathVariable Long employeeId, @RequestBody AssetDTO dto) {
        AssetDTO asset = employeeService.addAsset(employeeId, dto);
        return ResponseEntity.ok(
                ApiResponse.<AssetDTO>builder()
                        .success(true)
                        .message("Asset added successfully")
                        .data(asset)
                        .build()
        );
    }

    @PutMapping("/{employeeId}/assets/{assetId}")
    public ResponseEntity<ApiResponse<AssetDTO>> updateAsset(@PathVariable Long employeeId, @PathVariable Long assetId, @RequestBody AssetDTO dto) {
        AssetDTO asset = employeeService.updateAsset(employeeId, assetId, dto);
        return ResponseEntity.ok(
                ApiResponse.<AssetDTO>builder()
                        .success(true)
                        .message("Asset updated successfully")
                        .data(asset)
                        .build()
        );
    }

    @DeleteMapping("/{employeeId}/assets/{assetId}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable Long employeeId, @PathVariable Long assetId) {
        employeeService.deleteAsset(assetId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Asset deleted successfully")
                        .build()
        );
    }
}
