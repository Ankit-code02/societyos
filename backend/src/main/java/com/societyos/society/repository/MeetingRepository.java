package com.societyos.society.repository;

import com.societyos.society.entity.Meeting;
import com.societyos.society.entity.MeetingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MeetingRepository extends JpaRepository<Meeting, UUID> {

    List<Meeting> findBySocietyIdOrderByScheduledAtDesc(UUID societyId);

    List<Meeting> findBySocietyIdAndStatusOrderByScheduledAtAsc(
            UUID societyId,
            MeetingStatus status
    );
}