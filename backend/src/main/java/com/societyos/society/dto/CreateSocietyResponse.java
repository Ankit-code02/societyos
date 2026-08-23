package com.societyos.society.dto;

import com.societyos.society.entity.SocietyStatus;
import com.societyos.society.entity.SocietyVerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class CreateSocietyResponse {

    private UUID societyId;

    private UUID verificationId;

    private SocietyStatus status;

    private SocietyVerificationStatus verificationStatus;

    private String message;
}