package com.hrms.service;

import com.hrms.dto.*;
import com.hrms.entity.*;
import com.hrms.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PersonalDetailsRepository personalDetailsRepository;
    private final AddressRepository addressRepository;
    private final EducationRepository educationRepository;
    private final EmploymentRepository employmentRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final BankDetailsRepository bankDetailsRepository;
    private final PFDetailsRepository pfDetailsRepository;
    private final DocumentRepository documentRepository;
    private final AssetRepository assetRepository;
    private final ModelMapper modelMapper;

    // Employee CRUD
    public EmployeeDTO createEmployee(CreateEmployeeDTO dto) {
        Employee employee = modelMapper.map(dto, Employee.class);
        Employee saved = employeeRepository.save(employee);
        return modelMapper.map(saved, EmployeeDTO.class);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapEmployeeToDTO(employee);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::mapEmployeeToDTO)
                .collect(Collectors.toList());
    }

    public EmployeeDTO updateEmployee(Long id, CreateEmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        modelMapper.map(dto, employee);
        Employee updated = employeeRepository.save(employee);
        return mapEmployeeToDTO(updated);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }

    // Personal Details
    public PersonalDetailsDTO getPersonalDetails(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return personalDetailsRepository.findByEmployee(employee)
                .map(details -> modelMapper.map(details, PersonalDetailsDTO.class))
                .orElse(null);
    }

    public PersonalDetailsDTO updatePersonalDetails(Long employeeId, PersonalDetailsDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        PersonalDetails details = personalDetailsRepository.findByEmployee(employee)
                .orElse(new PersonalDetails());
        details.setEmployee(employee);
        modelMapper.map(dto, details);
        PersonalDetails saved = personalDetailsRepository.save(details);
        return modelMapper.map(saved, PersonalDetailsDTO.class);
    }

        public void deletePersonalDetails(Long employeeId) {
                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));
                personalDetailsRepository.findByEmployee(employee)
                                .ifPresent(personalDetailsRepository::delete);
        }

    // Addresses
    public List<AddressDTO> getAddresses(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return addressRepository.findByEmployee(employee)
                .stream()
                .map(addr -> modelMapper.map(addr, AddressDTO.class))
                .collect(Collectors.toList());
    }

    public AddressDTO addAddress(Long employeeId, AddressDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Address address = modelMapper.map(dto, Address.class);
        address.setEmployee(employee);
        Address saved = addressRepository.save(address);
        return modelMapper.map(saved, AddressDTO.class);
    }

    public AddressDTO updateAddress(Long employeeId, Long addressId, AddressDTO dto) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        modelMapper.map(dto, address);
        Address saved = addressRepository.save(address);
        return modelMapper.map(saved, AddressDTO.class);
    }

    public void deleteAddress(Long addressId) {
        addressRepository.deleteById(addressId);
    }

    // Education
    public List<EducationDTO> getEducation(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return educationRepository.findByEmployee(employee)
                .stream()
                .map(edu -> modelMapper.map(edu, EducationDTO.class))
                .collect(Collectors.toList());
    }

    public EducationDTO addEducation(Long employeeId, EducationDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Education education = modelMapper.map(dto, Education.class);
        education.setEmployee(employee);
        Education saved = educationRepository.save(education);
        return modelMapper.map(saved, EducationDTO.class);
    }

    public EducationDTO updateEducation(Long employeeId, Long educationId, EducationDTO dto) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Education education = educationRepository.findById(educationId)
                .orElseThrow(() -> new RuntimeException("Education not found"));
        modelMapper.map(dto, education);
        Education saved = educationRepository.save(education);
        return modelMapper.map(saved, EducationDTO.class);
    }

    public void deleteEducation(Long educationId) {
        educationRepository.deleteById(educationId);
    }

    // Employment
    public List<EmploymentDTO> getEmployment(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return employmentRepository.findByEmployee(employee)
                .stream()
                .map(emp -> modelMapper.map(emp, EmploymentDTO.class))
                .collect(Collectors.toList());
    }

    public EmploymentDTO addEmployment(Long employeeId, EmploymentDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Employment employment = modelMapper.map(dto, Employment.class);
        employment.setEmployee(employee);
        Employment saved = employmentRepository.save(employment);
        return modelMapper.map(saved, EmploymentDTO.class);
    }

    public EmploymentDTO updateEmployment(Long employeeId, Long employmentId, EmploymentDTO dto) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Employment employment = employmentRepository.findById(employmentId)
                .orElseThrow(() -> new RuntimeException("Employment not found"));
        modelMapper.map(dto, employment);
        Employment saved = employmentRepository.save(employment);
        return modelMapper.map(saved, EmploymentDTO.class);
    }

    public void deleteEmployment(Long employmentId) {
        employmentRepository.deleteById(employmentId);
    }

    // Family
    public List<FamilyMemberDTO> getFamily(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return familyMemberRepository.findByEmployee(employee)
                .stream()
                .map(fam -> modelMapper.map(fam, FamilyMemberDTO.class))
                .collect(Collectors.toList());
    }

    public FamilyMemberDTO addFamilyMember(Long employeeId, FamilyMemberDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        FamilyMember member = modelMapper.map(dto, FamilyMember.class);
        member.setEmployee(employee);
        FamilyMember saved = familyMemberRepository.save(member);
        return modelMapper.map(saved, FamilyMemberDTO.class);
    }

    public FamilyMemberDTO updateFamilyMember(Long employeeId, Long memberId, FamilyMemberDTO dto) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        FamilyMember member = familyMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Family member not found"));
        modelMapper.map(dto, member);
        FamilyMember saved = familyMemberRepository.save(member);
        return modelMapper.map(saved, FamilyMemberDTO.class);
    }

    public void deleteFamilyMember(Long memberId) {
        familyMemberRepository.deleteById(memberId);
    }

    // Bank Details
    public BankDetailsDTO getBankDetails(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return bankDetailsRepository.findByEmployee(employee)
                .map(details -> modelMapper.map(details, BankDetailsDTO.class))
                .orElse(null);
    }

    public BankDetailsDTO updateBankDetails(Long employeeId, BankDetailsDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        BankDetails details = bankDetailsRepository.findByEmployee(employee)
                .orElse(new BankDetails());
        details.setEmployee(employee);
        modelMapper.map(dto, details);
        BankDetails saved = bankDetailsRepository.save(details);
        return modelMapper.map(saved, BankDetailsDTO.class);
    }

        public void deleteBankDetails(Long employeeId) {
                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));
                bankDetailsRepository.findByEmployee(employee)
                                .ifPresent(bankDetailsRepository::delete);
        }

    // PF Details
    public PFDetailsDTO getPFDetails(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return pfDetailsRepository.findByEmployee(employee)
                .map(details -> modelMapper.map(details, PFDetailsDTO.class))
                .orElse(null);
    }

    public PFDetailsDTO updatePFDetails(Long employeeId, PFDetailsDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        PFDetails details = pfDetailsRepository.findByEmployee(employee)
                .orElse(new PFDetails());
        details.setEmployee(employee);
        modelMapper.map(dto, details);
        PFDetails saved = pfDetailsRepository.save(details);
        return modelMapper.map(saved, PFDetailsDTO.class);
    }

        public void deletePFDetails(Long employeeId) {
                Employee employee = employeeRepository.findById(employeeId)
                                .orElseThrow(() -> new RuntimeException("Employee not found"));
                pfDetailsRepository.findByEmployee(employee)
                                .ifPresent(pfDetailsRepository::delete);
        }

    // Documents
    public List<DocumentDTO> getDocuments(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return documentRepository.findByEmployee(employee)
                .stream()
                .map(doc -> modelMapper.map(doc, DocumentDTO.class))
                .collect(Collectors.toList());
    }

    public DocumentDTO addDocument(Long employeeId, DocumentDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Document document = modelMapper.map(dto, Document.class);
        document.setEmployee(employee);
        Document saved = documentRepository.save(document);
        return modelMapper.map(saved, DocumentDTO.class);
    }

    public DocumentDTO updateDocument(Long employeeId, Long documentId, DocumentDTO dto) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        modelMapper.map(dto, document);
        Document saved = documentRepository.save(document);
        return modelMapper.map(saved, DocumentDTO.class);
    }

    public void deleteDocument(Long documentId) {
        documentRepository.deleteById(documentId);
    }

    // Assets
    public List<AssetDTO> getAssets(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return assetRepository.findByEmployee(employee)
                .stream()
                .map(asset -> modelMapper.map(asset, AssetDTO.class))
                .collect(Collectors.toList());
    }

    public AssetDTO addAsset(Long employeeId, AssetDTO dto) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Asset asset = modelMapper.map(dto, Asset.class);
        asset.setEmployee(employee);
        Asset saved = assetRepository.save(asset);
        return modelMapper.map(saved, AssetDTO.class);
    }

    public AssetDTO updateAsset(Long employeeId, Long assetId, AssetDTO dto) {
        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        modelMapper.map(dto, asset);
        Asset saved = assetRepository.save(asset);
        return modelMapper.map(saved, AssetDTO.class);
    }

    public void deleteAsset(Long assetId) {
        assetRepository.deleteById(assetId);
    }

    // Helper
    private EmployeeDTO mapEmployeeToDTO(Employee employee) {
        EmployeeDTO dto = modelMapper.map(employee, EmployeeDTO.class);
        dto.setPersonalDetails(
                personalDetailsRepository.findByEmployee(employee)
                        .map(pd -> modelMapper.map(pd, PersonalDetailsDTO.class))
                        .orElse(null)
        );
        dto.setAddresses(addressRepository.findByEmployee(employee)
                .stream()
                .map(addr -> modelMapper.map(addr, AddressDTO.class))
                .collect(Collectors.toList())
        );
        dto.setEducation(educationRepository.findByEmployee(employee)
                .stream()
                .map(edu -> modelMapper.map(edu, EducationDTO.class))
                .collect(Collectors.toList())
        );
        return dto;
    }
}
