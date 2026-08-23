package com.societyos.notification.service;

import com.societyos.notification.dto.NotificationResponse;
import com.societyos.notification.entity.Notification;
import com.societyos.notification.repository.NotificationRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<NotificationResponse> getMyNotifications(
            UUID userId
    ) {
        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository
                .countByUserIdAndReadAtIsNull(userId);
    }

    @Transactional
    public void markAsRead(
            UUID userId,
            UUID notificationId
    ) {
        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Notification not found"
                                )
                        );

        if (!notification.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(
                    "You cannot modify this notification"
            );
        }

        if (notification.getReadAt() == null) {
            notification.setReadAt(
                    OffsetDateTime.now()
            );

            notificationRepository.save(notification);
        }
    }

    @Transactional
    public Notification createNotification(
            UUID userId,
            String type,
            String title,
            String message
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);

        return notificationRepository.save(notification);
    }
}