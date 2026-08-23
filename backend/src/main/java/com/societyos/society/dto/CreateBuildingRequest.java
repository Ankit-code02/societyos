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
public class CreateBuildingRequest {

    @NotBlank(message = "Building name is required")
    @Size(max = 100, message = "Building name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Building code is required")
    @Size(max = 30, message = "Building code must not exceed 30 characters")
    private String code;

    @Min(value = 1, message = "Floor count must be at least 1")
    private int floorCount;

    @Min(value = 1, message = "Unit count must be at least 1")
    private int unitCount;
}