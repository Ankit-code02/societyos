package com.societyos.society.dto;

import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyMemberStatus;
import com.societyos.society.entity.SocietyPosition;
import com.societyos.society.entity.SocietyStatus;

import java.util.UUID;

public record MySocietyResponse(
        UUID societyId,
        String societyName,
        SocietyStatus societyStatus,
        SocietyMemberRole role,
        SocietyPosition position,
        SocietyMemberStatus membershipStatus
) {
}