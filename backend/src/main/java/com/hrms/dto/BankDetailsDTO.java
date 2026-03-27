package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankDetailsDTO {
    private Long id;
    private String accountHolderName;
    private String accountNumber;
    private String ifscCode;
    private String bankName;
    private String branchName;
    private String accountType;
}
