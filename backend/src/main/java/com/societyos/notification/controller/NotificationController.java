package com.societyos.notification.controller;

import com.societyos.notification.dto.NotificationCountResponse;
import com.societyos.notification.dto.NotificationResponse;
import com.societyos.notification.service.NotificationService;
import com.societyos.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return notificationService.getMyNotifications(
                user.getId()
        );
    }

    @GetMapping("/unread-count")
    public NotificationCountResponse getUnreadCount(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return new NotificationCountResponse(
                notificationService.getUnreadCount(
                        user.getId()
                )
        );
    }

    @PutMapping("/{notificationId}/read")
    public void markAsRead(
            @PathVariable UUID notificationId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        notificationService.markAsRead(
                user.getId(),
                notificationId
        );
    }
}