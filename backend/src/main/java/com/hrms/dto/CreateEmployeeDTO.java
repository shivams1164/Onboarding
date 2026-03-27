package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateEmployeeDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String employeeId;
    private String designation;
    private String department;
    private String dateOfJoining;
    private String status;
}
