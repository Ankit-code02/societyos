package com.societyos.society.repository;

import com.societyos.society.entity.Complaint;
import com.societyos.society.entity.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ComplaintRepository
        extends JpaRepository<Complaint, UUID> {

    List<Complaint> findBySocietyIdOrderByCreatedAtDesc(
            UUID societyId
    );

    List<Complaint> findByCreatedByIdOrderByCreatedAtDesc(
            UUID userId
    );

    List<Complaint> findBySocietyIdAndStatusOrderByCreatedAtDesc(
            UUID societyId,
            ComplaintStatus status
    );

    List<Complaint> findByAssignedToIdOrderByCreatedAtDesc(
            UUID userId
    );
}