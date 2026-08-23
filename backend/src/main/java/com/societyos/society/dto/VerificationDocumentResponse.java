package com.societyos.society.dto;

import com.societyos.society.entity.SocietyDocumentType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class VerificationDocumentResponse {

    private UUID documentId;

    private UUID verificationId;

    private SocietyDocumentType documentType;

    private String fileName;

    private OffsetDateTime uploadedAt;

    private String message;
}