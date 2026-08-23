package com.societyos.society.repository;

import com.societyos.society.entity.ResidentInvitation;
import com.societyos.society.entity.ResidentInvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResidentInvitationRepository
        extends JpaRepository<ResidentInvitation, UUID> {

    Optional<ResidentInvitation> findByTokenHash(
            String tokenHash
    );

    boolean existsBySocietyIdAndEmailAndStatus(
            UUID societyId,
            String email,
            ResidentInvitationStatus status
    );

    boolean existsByUnitIdAndStatus(
            UUID unitId,
            ResidentInvitationStatus status
    );

    List<ResidentInvitation>
    findAllBySocietyIdOrderByCreatedAtDesc(
            UUID societyId
    );
}