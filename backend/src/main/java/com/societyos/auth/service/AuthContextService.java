package com.societyos.auth.service;

import com.societyos.auth.dto.AuthContextResponse;
import com.societyos.society.entity.SocietyMember;
import com.societyos.society.entity.SocietyMemberStatus;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.society.entity.SocietyVerification;
import com.societyos.society.repository.SocietyVerificationRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthContextService {

    private final UserRepository userRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final SocietyVerificationRepository societyVerificationRepository;

    @Transactional(readOnly = true)
    public AuthContextResponse getContext(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );

        SocietyMember membership =
                societyMemberRepository
                        .findFirstByUserIdAndStatus(
                                userId,
                                SocietyMemberStatus.ACTIVE
                        )
                        .orElse(null);

        AuthContextResponse.AuthContextResponseBuilder builder =
                AuthContextResponse.builder()
                        .userId(user.getId())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .email(user.getEmail())
                        .emailVerified(user.getEmailVerifiedAt() != null)
                        .hasSociety(membership != null)
                        .hasActiveMembership(membership != null);

        if (membership == null) {
            return builder.build();
        }

        builder
                .societyId(membership.getSociety().getId())
                .societyName(membership.getSociety().getName())
                .role(membership.getRole().name())
                .position(membership.getPosition().name())
                .membershipStatus(membership.getStatus().name());

        SocietyVerification verification =
                societyVerificationRepository
                        .findBySocietyId(membership.getSociety().getId())
                        .orElse(null);

        if (verification != null) {
            builder.societyVerificationStatus(
                    verification.getStatus().name()
            );
        }

        if (membership.getUnit() != null) {
            builder.unitId(membership.getUnit().getId());
        }

        return builder.build();
    }
}