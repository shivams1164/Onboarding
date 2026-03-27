package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetDTO {
    private Long id;
    private String type;
    private String serialNumber;
    private String allocationDate;
    private String notes;
}
