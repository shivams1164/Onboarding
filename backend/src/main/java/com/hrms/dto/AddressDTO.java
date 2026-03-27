package com.hrms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private Long id;
    private String type;
    private String street;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    private Boolean isPrimary;
}
