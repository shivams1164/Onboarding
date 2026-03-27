package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PFDetailsDTO {
    private Long id;
    private String uan;
    private String pfNumber;
    private String pfJoiningDate;
    private Double employeeContribution;
    private Double employerContribution;
}
