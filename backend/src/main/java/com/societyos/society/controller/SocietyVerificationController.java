package com.societyos.society.controller;

import com.societyos.society.dto.SubmitVerificationResponse;
import com.societyos.society.dto.UploadVerificationDocumentRequest;
import com.societyos.society.dto.VerificationDocumentResponse;
import com.societyos.society.service.SocietyVerificationService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.societyos.society.dto.ReviewVerificationRequest;
import com.societyos.society.dto.ReviewVerificationResponse;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
public class SocietyVerificationController {

    private final SocietyVerificationService societyVerificationService;

    @PostMapping("/{societyId}/verification/documents")
    public ResponseEntity<VerificationDocumentResponse> uploadDocument(
            @PathVariable UUID societyId,
            @Valid @RequestBody UploadVerificationDocumentRequest request,
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        VerificationDocumentResponse response =
                societyVerificationService.uploadDocument(
                        authenticatedUser.getId(),
                        societyId,
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @PostMapping("/{societyId}/verification/submit")
    public ResponseEntity<SubmitVerificationResponse> submitVerification(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        SubmitVerificationResponse response =
                societyVerificationService.submitVerification(
                        authenticatedUser.getId(),
                        societyId
                );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/{societyId}/verification/review")
    public ResponseEntity<ReviewVerificationResponse> reviewVerification(
            @PathVariable UUID societyId,
            @Valid @RequestBody ReviewVerificationRequest request,
            Authentication authentication
    ) {

        User reviewer =
                (User) authentication.getPrincipal();

        ReviewVerificationResponse response =
                societyVerificationService.reviewVerification(
                        reviewer.getId(),
                        societyId,
                        request
                );

        return ResponseEntity.ok(response);
    }
}