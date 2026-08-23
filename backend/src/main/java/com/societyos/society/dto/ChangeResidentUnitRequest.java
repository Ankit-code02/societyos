package com.societyos.society.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class ChangeResidentUnitRequest {

    @NotNull(message = "Unit ID is required")
    private UUID unitId;
}