package com.societyos.society.dto;

import com.societyos.society.entity.ComplaintCategory;
import com.societyos.society.entity.ComplaintPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateComplaintRequest {

    @NotNull
    private ComplaintCategory category;

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotBlank
    @Size(max = 5000)
    private String description;

    private ComplaintPriority priority;

    private UUID unitId;
}