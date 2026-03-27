package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String employeeId;
    private String designation;
    private String department;
    private String dateOfJoining;
    private String status;
    private String profilePhotoUrl;
    private PersonalDetailsDTO personalDetails;
    private List<AddressDTO> addresses;
    private List<EducationDTO> education;
    private List<EmploymentDTO> employment;
    private List<FamilyMemberDTO> family;
    private BankDetailsDTO bankDetails;
    private PFDetailsDTO pfDetails;
    private List<DocumentDTO> documents;
    private List<AssetDTO> assets;
}
