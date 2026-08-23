package com.societyos.society.dto;

import com.societyos.society.entity.SocietyClaimedPosition;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateSocietyRequest {

    @NotBlank(message = "Society name is required")
    @Size(
            min = 3,
            max = 150,
            message = "Society name must be between 3 and 150 characters"
    )
    private String name;

    @NotBlank(message = "Address is required")
    @Size(
            min = 5,
            max = 255,
            message = "Address must be between 5 and 255 characters"
    )
    private String addressLine;

    @NotBlank(message = "City is required")
    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @NotBlank(message = "PIN code is required")
    @Pattern(
            regexp = "^[1-9][0-9]{5}$",
            message = "PIN code must be a valid 6-digit Indian PIN code"
    )
    private String pinCode;

    @NotNull(message = "Building count is required")
    @Min(
            value = 1,
            message = "Building count must be at least 1"
    )
    private Integer buildingCount;

    @NotNull(message = "Unit count is required")
    @Min(
            value = 1,
            message = "Unit count must be at least 1"
    )
    private Integer unitCount;

    @NotNull(message = "Claimed position is required")
    private SocietyClaimedPosition claimedPosition;
}