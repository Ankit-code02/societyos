package com.societyos.notification.repository;

import com.societyos.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository
        extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(
            UUID userId
    );

    long countByUserIdAndReadAtIsNull(
            UUID userId
    );
}