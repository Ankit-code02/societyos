package com.societyos.society.controller;

import com.societyos.society.dto.AcceptResidentInvitationRequest;
import com.societyos.society.dto.CreateResidentInvitationRequest;
import com.societyos.society.dto.ResidentInvitationPreviewResponse;
import com.societyos.society.dto.ResidentInvitationResponse;
import com.societyos.society.service.ResidentInvitationService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ResidentInvitationController {

    private final ResidentInvitationService residentInvitationService;

    @PostMapping("/societies/{societyId}/resident-invitations")
    public ResponseEntity<ResidentInvitationResponse> createInvitation(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateResidentInvitationRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        ResidentInvitationResponse response =
                residentInvitationService.createInvitation(
                        societyId,
                        user.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/resident-invitations/preview")
    public ResponseEntity<ResidentInvitationPreviewResponse>
    previewInvitation(
            @RequestParam String token
    ) {

        ResidentInvitationPreviewResponse response =
                residentInvitationService.previewInvitation(
                        token
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/resident-invitations/accept")
    public ResponseEntity<ResidentInvitationResponse> acceptInvitation(
            @Valid @RequestBody AcceptResidentInvitationRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        ResidentInvitationResponse response =
                residentInvitationService.acceptInvitation(
                        user.getId(),
                        request
                );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/societies/{societyId}/resident-invitations")
    public ResponseEntity<List<ResidentInvitationResponse>> getInvitations(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                residentInvitationService.getInvitations(
                        societyId,
                        user.getId()
                )
        );
    }

    @PostMapping(
            "/societies/{societyId}/resident-invitations/{invitationId}/resend"
    )
    public ResponseEntity<ResidentInvitationResponse> resendInvitation(
            @PathVariable UUID societyId,
            @PathVariable UUID invitationId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                residentInvitationService.resendInvitation(
                        societyId,
                        user.getId(),
                        invitationId
                )
        );
    }

    @DeleteMapping(
            "/societies/{societyId}/resident-invitations/{invitationId}"
    )
    public ResponseEntity<ResidentInvitationResponse> cancelInvitation(
            @PathVariable UUID societyId,
            @PathVariable UUID invitationId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                residentInvitationService.cancelInvitation(
                        societyId,
                        user.getId(),
                        invitationId
                )
        );
    }
}