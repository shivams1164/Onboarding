package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalDetailsDTO {
    private Long id;
    private String dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String maritalStatus;
    private String nationality;
    private String aadharNumber;
    private String panNumber;
    private String passportNumber;
}
