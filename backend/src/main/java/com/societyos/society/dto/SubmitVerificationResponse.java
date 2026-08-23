package com.societyos.society.dto;

import com.societyos.society.entity.SocietyVerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class SubmitVerificationResponse {

    private UUID societyId;

    private UUID verificationId;

    private SocietyVerificationStatus status;

    private OffsetDateTime submittedAt;

    private String message;
}