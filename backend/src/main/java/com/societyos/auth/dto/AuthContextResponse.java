package com.societyos.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class AuthContextResponse {

    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;

    private boolean emailVerified;

    private boolean hasSociety;
    private boolean hasActiveMembership;

    private UUID societyId;
    private String societyName;

    private String role;
    private String position;
    private String membershipStatus;
    private String societyVerificationStatus;

    private UUID unitId;
}