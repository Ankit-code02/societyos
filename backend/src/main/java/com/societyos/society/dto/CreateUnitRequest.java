package com.societyos.society.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateUnitRequest {

    @NotBlank(message = "Unit number is required")
    @Size(max = 30, message = "Unit number must not exceed 30 characters")
    private String unitNumber;

    @Min(value = 0, message = "Floor number cannot be negative")
    private int floorNumber;

    @NotBlank(message = "Unit type is required")
    @Size(max = 30, message = "Unit type must not exceed 30 characters")
    private String unitType;

    @NotBlank(message = "Unit status is required")
    @Size(max = 30, message = "Unit status must not exceed 30 characters")
    private String status;
}