package com.societyos.society.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AiConversationResponse(
        UUID id,
        UUID societyId,
        UUID userId,
        String title,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}