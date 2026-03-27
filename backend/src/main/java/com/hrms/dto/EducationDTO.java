package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDTO {
    private Long id;
    private String degree;
    private String fieldOfStudy;
    private String school;
    private String startDate;
    private String endDate;
    private String description;
    private String certificateUrl;
}
