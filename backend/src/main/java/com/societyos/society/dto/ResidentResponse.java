package com.societyos.society.dto;

import com.societyos.society.entity.SocietyMember;
import lombok.Getter;

import java.util.UUID;

@Getter
public class ResidentResponse {

    private final UUID memberId;
    private final UUID userId;
    private final String email;
    private final UUID societyId;
    private final UUID unitId;
    private final String unitNumber;
    private final String role;
    private final String position;
    private final String status;
    private final Object joinedAt;

    public ResidentResponse(SocietyMember member) {
        this.memberId = member.getId();
        this.userId = member.getUser().getId();
        this.email = member.getUser().getEmail();
        this.societyId = member.getSociety().getId();

        this.unitId =
                member.getUnit() != null
                        ? member.getUnit().getId()
                        : null;

        this.unitNumber =
                member.getUnit() != null
                        ? member.getUnit().getUnitNumber()
                        : null;

        this.role = member.getRole().name();
        this.position = member.getPosition().name();
        this.status = member.getStatus().name();
        this.joinedAt = member.getJoinedAt();
    }
}