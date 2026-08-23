package com.societyos.society.repository;

import com.societyos.society.entity.SocietyVerification;
import com.societyos.society.entity.SocietyVerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SocietyVerificationRepository
        extends JpaRepository<SocietyVerification, UUID> {

    List<SocietyVerification> findByStatus(
            SocietyVerificationStatus status
    );

    Optional<SocietyVerification> findBySocietyId(
            UUID societyId
    );
}