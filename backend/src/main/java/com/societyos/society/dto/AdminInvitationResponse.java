package com.societyos.society.dto;

import com.societyos.society.entity.AdminInvitationStatus;
import com.societyos.society.entity.SocietyPosition;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class AdminInvitationResponse {

    private UUID invitationId;
    private UUID societyId;
    private String email;
    private SocietyPosition position;
    private AdminInvitationStatus status;
    private OffsetDateTime expiresAt;
    private OffsetDateTime createdAt;
}