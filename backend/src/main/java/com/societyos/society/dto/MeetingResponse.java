package com.societyos.society.dto;

import com.societyos.society.entity.MeetingStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MeetingResponse(
        UUID id,
        UUID societyId,
        UUID createdBy,
        String createdByEmail,
        String title,
        String description,
        OffsetDateTime scheduledAt,
        String venue,
        MeetingStatus status,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}