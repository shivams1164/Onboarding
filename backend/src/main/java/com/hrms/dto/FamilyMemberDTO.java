package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FamilyMemberDTO {
    private Long id;
    private String name;
    private String relationship;
    private String dateOfBirth;
    private String mobileNumber;
    private String dependentStatus;
}
