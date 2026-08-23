package com.societyos.society.repository;

import com.societyos.society.entity.AdminInvitation;
import com.societyos.society.entity.AdminInvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AdminInvitationRepository
        extends JpaRepository<AdminInvitation, UUID> {

    Optional<AdminInvitation> findByTokenHash(String tokenHash);

    boolean existsBySocietyIdAndEmailAndStatus(
            UUID societyId,
            String email,
            AdminInvitationStatus status
    );
}