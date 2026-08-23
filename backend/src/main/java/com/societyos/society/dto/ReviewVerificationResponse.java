package com.societyos.society.dto;

import com.societyos.society.entity.SocietyStatus;
import com.societyos.society.entity.SocietyVerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class ReviewVerificationResponse {

    private UUID societyId;

    private UUID verificationId;

    private SocietyVerificationStatus verificationStatus;

    private SocietyStatus societyStatus;

    private UUID reviewedBy;

    private OffsetDateTime reviewedAt;

    private String message;
}