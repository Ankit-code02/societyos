package com.societyos.society.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AssignComplaintRequest {

    @NotNull
    private UUID assignedTo;
}