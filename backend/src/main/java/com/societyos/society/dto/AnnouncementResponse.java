package com.societyos.society.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class AnnouncementResponse {

    private UUID id;

    private UUID societyId;

    private UUID createdBy;

    private String createdByEmail;

    private String title;

    private String content;

    private String category;

    private String status;

    private OffsetDateTime publishedAt;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}