package com.societyos.society.dto;

import com.societyos.society.entity.ResidentInvitationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class ResidentInvitationResponse {

    private UUID invitationId;

    private UUID societyId;

    private UUID unitId;

    private String email;

    private ResidentInvitationStatus status;

    private OffsetDateTime expiresAt;

    private OffsetDateTime createdAt;
}