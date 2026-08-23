package com.societyos.society.controller;

import com.societyos.society.dto.AcceptAdminInvitationRequest;
import com.societyos.society.dto.AdminInvitationResponse;
import com.societyos.society.dto.CreateAdminInvitationRequest;
import com.societyos.society.dto.CreateSocietyRequest;
import com.societyos.society.dto.CreateSocietyResponse;
import com.societyos.society.service.AdminInvitationService;
import com.societyos.society.service.SocietyService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.societyos.society.dto.MySocietyResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
public class SocietyController {

    private final SocietyService societyService;
    private final AdminInvitationService adminInvitationService;

    @PostMapping
    public ResponseEntity<CreateSocietyResponse> createSociety(
            @Valid @RequestBody CreateSocietyRequest request,
            Authentication authentication
    ) {
        User authenticatedUser =
                (User) authentication.getPrincipal();

        CreateSocietyResponse response =
                societyService.createSociety(
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/{societyId}/admin-invitations")
    public ResponseEntity<AdminInvitationResponse> createAdminInvitation(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateAdminInvitationRequest request,
            Authentication authentication
    ) {
        User authenticatedUser =
                (User) authentication.getPrincipal();

        AdminInvitationResponse response =
                adminInvitationService.createInvitation(
                        societyId,
                        authenticatedUser.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/{societyId}/admin-invitations/accept")
    public ResponseEntity<AdminInvitationResponse> acceptAdminInvitation(
            @PathVariable UUID societyId,
            @Valid @RequestBody AcceptAdminInvitationRequest request,
            Authentication authentication
    ) {
        User authenticatedUser =
                (User) authentication.getPrincipal();

        AdminInvitationResponse response =
                adminInvitationService.acceptInvitation(
                        societyId,
                        request.getToken(),
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/mine")
    public ResponseEntity<List<MySocietyResponse>> getMySocieties(
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        List<MySocietyResponse> response =
                societyService.getMySocieties(
                        authenticatedUser.getId()
                );

        return ResponseEntity.ok(response);
    }
}