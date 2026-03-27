package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmploymentDTO {
    private Long id;
    private String jobTitle;
    private String department;
    private String startDate;
    private String endDate;
    private Boolean isCurrentJob;
    private String reportingManager;
    private Double salary;
    private String employmentType;
}
