package com.societyos.society.service;

import com.societyos.society.dto.AdminInvitationResponse;
import com.societyos.society.dto.CreateAdminInvitationRequest;
import com.societyos.society.entity.*;
import com.societyos.society.repository.AdminInvitationRepository;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminInvitationService {

    private final AdminInvitationRepository adminInvitationRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AdminInvitationResponse createInvitation(
            UUID societyId,
            UUID adminUserId,
            CreateAdminInvitationRequest request
    ) {

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Society not found")
                );

        if (society.getStatus() != SocietyStatus.VERIFIED) {
            throw new IllegalStateException(
                    "Admin invitations can only be created for a verified society"
            );
        }

        boolean isAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRole(
                                societyId,
                                adminUserId,
                                SocietyMemberRole.SOCIETY_ADMIN
                        );

        if (!isAdmin) {
            throw new IllegalStateException(
                    "Only society administrators can invite admins"
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        if (request.getPosition() == SocietyPosition.OWNER) {
            throw new IllegalArgumentException(
                    "OWNER position cannot be assigned through an invitation"
            );
        }

        if (request.getPosition() == SocietyPosition.RESIDENT) {
            throw new IllegalArgumentException(
                    "RESIDENT position cannot be used for an admin invitation"
            );
        }

        boolean alreadyMember =
                userRepository.findByEmail(email)
                        .map(user ->
                                societyMemberRepository
                                        .existsBySocietyIdAndUserId(
                                                societyId,
                                                user.getId()
                                        )
                        )
                        .orElse(false);

        if (alreadyMember) {
            throw new IllegalStateException(
                    "This user is already a member of the society"
            );
        }

        boolean pendingInvitation =
                adminInvitationRepository
                        .existsBySocietyIdAndEmailAndStatus(
                                societyId,
                                email,
                                AdminInvitationStatus.PENDING
                        );

        if (pendingInvitation) {
            throw new IllegalStateException(
                    "A pending invitation already exists for this email"
            );
        }

        User invitedBy = userRepository.findById(adminUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Inviting administrator not found"
                        )
                );

        String rawToken = generateToken();
        String tokenHash = hashToken(rawToken);

        AdminInvitation invitation = new AdminInvitation();

        invitation.setSociety(society);
        invitation.setInvitedBy(invitedBy);
        invitation.setEmail(email);
        invitation.setPosition(request.getPosition());
        invitation.setTokenHash(tokenHash);
        invitation.setExpiresAt(
                OffsetDateTime.now().plus(48, ChronoUnit.HOURS)
        );
        invitation.setStatus(AdminInvitationStatus.PENDING);

        AdminInvitation saved =
                adminInvitationRepository.save(invitation);

        /*
         * Development only:
         * In production this token should be delivered through
         * email or another secure notification channel.
         */
        System.out.println(
                "DEVELOPMENT ADMIN INVITATION TOKEN | " +
                        "invitationId=" + saved.getId() +
                        " | email=" + saved.getEmail() +
                        " | token=" + rawToken
        );

        return toResponse(saved);
    }

    private String generateToken() {

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return HexFormat.of().formatHex(bytes);
    }

    private String hashToken(String rawToken) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash =
                    digest.digest(
                            rawToken.getBytes(StandardCharsets.UTF_8)
                    );

            return HexFormat.of().formatHex(hash);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to generate invitation token hash",
                    exception
            );
        }
    }

    private AdminInvitationResponse toResponse(
            AdminInvitation invitation
    ) {

        return new AdminInvitationResponse(
                invitation.getId(),
                invitation.getSociety().getId(),
                invitation.getEmail(),
                invitation.getPosition(),
                invitation.getStatus(),
                invitation.getExpiresAt(),
                invitation.getCreatedAt()
        );
    }
    @Transactional
    public AdminInvitationResponse acceptInvitation(
            UUID societyId,
            String rawToken,
            UUID userId
    ) {

        String tokenHash = hashToken(rawToken);

        AdminInvitation invitation =
                adminInvitationRepository.findByTokenHash(tokenHash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid invitation token"
                                )
                        );
        if (!invitation.getSociety().getId().equals(societyId)) {
            throw new IllegalStateException(
                    "Invitation does not belong to this society"
            );
        }

        if (invitation.getStatus() != AdminInvitationStatus.PENDING) {
            throw new IllegalStateException(
                    "This invitation is no longer pending"
            );
        }

        if (invitation.getExpiresAt().isBefore(OffsetDateTime.now())) {

            invitation.setStatus(AdminInvitationStatus.EXPIRED);

            adminInvitationRepository.save(invitation);

            throw new IllegalStateException(
                    "This invitation has expired"
            );
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (!user.getEmail().equalsIgnoreCase(invitation.getEmail())) {
            throw new IllegalStateException(
                    "This invitation belongs to a different email address"
            );
        }

        boolean alreadyMember =
                societyMemberRepository.existsBySocietyIdAndUserId(
                        invitation.getSociety().getId(),
                        userId
                );

        if (alreadyMember) {
            throw new IllegalStateException(
                    "User is already a member of this society"
            );
        }

        SocietyMember member = new SocietyMember();

        member.setSociety(invitation.getSociety());
        member.setUser(user);
        member.setUnit(null);
        member.setRole(SocietyMemberRole.SOCIETY_ADMIN);
        member.setPosition(invitation.getPosition());
        member.setStatus(SocietyMemberStatus.ACTIVE);
        member.setJoinedAt(OffsetDateTime.now());

        societyMemberRepository.save(member);

        invitation.setStatus(AdminInvitationStatus.ACCEPTED);
        invitation.setAcceptedAt(OffsetDateTime.now());

        AdminInvitation saved =
                adminInvitationRepository.save(invitation);

        return toResponse(saved);
    }
}