package com.societyos.society.repository;

import com.societyos.society.entity.SocietyMember;
import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyMemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SocietyMemberRepository
        extends JpaRepository<SocietyMember, UUID> {

    Optional<SocietyMember> findBySocietyIdAndUserId(
            UUID societyId,
            UUID userId
    );

    boolean existsBySocietyIdAndUserId(
            UUID societyId,
            UUID userId
    );

    boolean existsBySocietyIdAndUserIdAndRole(
            UUID societyId,
            UUID userId,
            SocietyMemberRole role
    );

    List<SocietyMember> findAllBySocietyIdOrderByCreatedAtAsc(
            UUID societyId
    );

    boolean existsByUnitId(UUID unitId);

    boolean existsBySocietyIdAndUserIdAndRoleAndStatus(
            UUID societyId,
            UUID userId,
            SocietyMemberRole role,
            SocietyMemberStatus status
    );

    Optional<SocietyMember> findFirstByUserIdAndStatus(
            UUID userId,
            SocietyMemberStatus status
    );
    List<SocietyMember> findAllByUserIdAndStatusOrderByCreatedAtAsc(
            UUID userId,
            SocietyMemberStatus status
    );
}