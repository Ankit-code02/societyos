package com.societyos.society.dto;

import com.societyos.society.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateComplaintStatusRequest {

    @NotNull
    private ComplaintStatus status;

    private String resolutionNote;
}