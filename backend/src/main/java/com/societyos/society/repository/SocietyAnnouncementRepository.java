package com.societyos.society.repository;

import com.societyos.society.entity.AnnouncementStatus;
import com.societyos.society.entity.SocietyAnnouncement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SocietyAnnouncementRepository
        extends JpaRepository<SocietyAnnouncement, UUID> {

    List<SocietyAnnouncement> findBySocietyIdOrderByCreatedAtDesc(
            UUID societyId
    );

    List<SocietyAnnouncement> findBySocietyIdAndStatusOrderByCreatedAtDesc(
            UUID societyId,
            AnnouncementStatus status
    );
}