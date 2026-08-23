package com.societyos.society.dto;

import com.societyos.society.entity.MaintenanceDueStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record MaintenanceDueResponse(
        UUID id,
        UUID societyId,
        UUID unitId,
        String unitNumber,
        UUID createdBy,
        String createdByEmail,
        String title,
        String description,
        BigDecimal amount,
        LocalDate dueDate,
        MaintenanceDueStatus status,
        OffsetDateTime paidAt,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}