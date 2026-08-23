package com.societyos.society.dto;

import com.societyos.society.entity.ComplaintCategory;
import com.societyos.society.entity.ComplaintPriority;
import com.societyos.society.entity.ComplaintStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@Builder
public class ComplaintResponse {

    private UUID id;

    private UUID societyId;

    private UUID createdBy;

    private String createdByEmail;

    private UUID unitId;

    private String unitNumber;

    private ComplaintCategory category;

    private String title;

    private String description;

    private ComplaintPriority priority;

    private ComplaintStatus status;

    private UUID assignedTo;

    private String assignedToEmail;

    private String resolutionNote;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    private OffsetDateTime resolvedAt;
}