package com.societyos.society.dto;

import com.societyos.society.entity.AiMessageRole;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AiMessageResponse(
        UUID id,
        UUID conversationId,
        AiMessageRole role,
        String content,
        OffsetDateTime createdAt
) {
}