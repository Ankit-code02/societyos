package com.societyos.notification.dto;

import com.societyos.notification.entity.Notification;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
public class NotificationResponse {

    private final UUID id;
    private final String type;
    private final String title;
    private final String message;
    private final boolean read;
    private final OffsetDateTime createdAt;
    private final OffsetDateTime readAt;

    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.type = notification.getType();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.read = notification.getReadAt() != null;
        this.createdAt = notification.getCreatedAt();
        this.readAt = notification.getReadAt();
    }
}