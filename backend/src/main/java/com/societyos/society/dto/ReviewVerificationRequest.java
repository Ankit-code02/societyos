package com.societyos.society.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewVerificationRequest {

    @NotNull(message = "Review decision is required")
    private ReviewDecision decision;

    private String rejectionReason;
}