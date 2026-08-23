package com.societyos.society.service;

import com.societyos.society.dto.AcceptResidentInvitationRequest;
import com.societyos.society.dto.CreateResidentInvitationRequest;
import com.societyos.society.dto.ResidentInvitationPreviewResponse;
import com.societyos.society.dto.ResidentInvitationResponse;
import com.societyos.society.entity.*;
import com.societyos.society.repository.ResidentInvitationRepository;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.society.repository.UnitRepository;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResidentInvitationService {

    private final ResidentInvitationRepository residentInvitationRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final ResidentInvitationEmailService residentInvitationEmailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public ResidentInvitationResponse createInvitation(
            UUID societyId,
            UUID adminUserId,
            CreateResidentInvitationRequest request
    ) {

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Society not found"
                        )
                );

        if (society.getStatus() != SocietyStatus.VERIFIED) {
            throw new IllegalStateException(
                    "Resident invitations can only be created for a verified society"
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
                    "Only society administrators can invite residents"
            );
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        Unit unit = unitRepository.findById(request.getUnitId())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unit not found"
                        )
                );

        if (!unit.getBuilding()
                .getSociety()
                .getId()
                .equals(societyId)) {

            throw new IllegalStateException(
                    "Unit does not belong to this society"
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
                residentInvitationRepository
                        .existsBySocietyIdAndEmailAndStatus(
                                societyId,
                                email,
                                ResidentInvitationStatus.PENDING
                        );

        if (pendingInvitation) {
            throw new IllegalStateException(
                    "A pending resident invitation already exists for this email"
            );
        }

        boolean unitHasPendingInvitation =
                residentInvitationRepository
                        .existsByUnitIdAndStatus(
                                unit.getId(),
                                ResidentInvitationStatus.PENDING
                        );

        if (unitHasPendingInvitation) {
            throw new IllegalStateException(
                    "This unit already has a pending resident invitation"
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

        ResidentInvitation invitation =
                new ResidentInvitation();

        invitation.setSociety(society);
        invitation.setUnit(unit);
        invitation.setInvitedBy(invitedBy);
        invitation.setEmail(email);
        invitation.setTokenHash(tokenHash);
        invitation.setExpiresAt(
                OffsetDateTime.now()
                        .plus(48, ChronoUnit.HOURS)
        );
        invitation.setStatus(
                ResidentInvitationStatus.PENDING
        );

        ResidentInvitation saved =
                residentInvitationRepository.save(
                        invitation
                );

        residentInvitationEmailService.sendInvitation(
                saved.getEmail(),
                null,
                society.getName(),
                unit.getBuilding().getName(),
                unit.getUnitNumber(),
                rawToken
        );

        return toResponse(saved);
    }
    @Transactional(readOnly = true)
    public List<ResidentInvitationResponse> getInvitations(
            UUID societyId,
            UUID adminUserId
    ) {

        ensureAdmin(societyId, adminUserId);

        return residentInvitationRepository
                .findAllBySocietyIdOrderByCreatedAtDesc(societyId)
                .stream()
                .map(invitation -> {

                    if (
                            invitation.getStatus()
                                    == ResidentInvitationStatus.PENDING
                                    &&
                                    invitation.getExpiresAt()
                                            .isBefore(OffsetDateTime.now())
                    ) {
                        invitation.setStatus(
                                ResidentInvitationStatus.EXPIRED
                        );
                    }

                    return toResponse(invitation);
                })
                .toList();
    }
    @Transactional
    public ResidentInvitationResponse resendInvitation(
            UUID societyId,
            UUID adminUserId,
            UUID invitationId
    ) {

        ensureAdmin(societyId, adminUserId);

        ResidentInvitation oldInvitation =
                residentInvitationRepository.findById(invitationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invitation not found"
                                )
                        );

        if (!oldInvitation.getSociety()
                .getId()
                .equals(societyId)) {

            throw new IllegalArgumentException(
                    "Invitation does not belong to this society"
            );
        }

        if (
                oldInvitation.getStatus()
                        == ResidentInvitationStatus.ACCEPTED
        ) {
            throw new IllegalStateException(
                    "Accepted invitations cannot be resent"
            );
        }

        if (
                oldInvitation.getStatus()
                        == ResidentInvitationStatus.CANCELLED
        ) {
            throw new IllegalStateException(
                    "Cancelled invitations cannot be resent"
            );
        }

        Unit unit = oldInvitation.getUnit();

        boolean unitHasAnotherPendingInvitation =
                residentInvitationRepository
                        .existsByUnitIdAndStatus(
                                unit.getId(),
                                ResidentInvitationStatus.PENDING
                        );

        if (unitHasAnotherPendingInvitation) {
            throw new IllegalStateException(
                    "This unit already has a pending invitation"
            );
        }

        String rawToken = generateToken();
        String tokenHash = hashToken(rawToken);

        oldInvitation.setTokenHash(tokenHash);
        oldInvitation.setExpiresAt(
                OffsetDateTime.now()
                        .plus(48, ChronoUnit.HOURS)
        );
        oldInvitation.setStatus(
                ResidentInvitationStatus.PENDING
        );
        oldInvitation.setAcceptedAt(null);

        ResidentInvitation saved =
                residentInvitationRepository.save(
                        oldInvitation
                );

        residentInvitationEmailService.sendInvitation(
                saved.getEmail(),
                null,
                saved.getSociety().getName(),
                saved.getUnit().getBuilding().getName(),
                saved.getUnit().getUnitNumber(),
                rawToken
        );

        return toResponse(saved);
    }
    @Transactional
    public ResidentInvitationResponse cancelInvitation(
            UUID societyId,
            UUID adminUserId,
            UUID invitationId
    ) {

        ensureAdmin(societyId, adminUserId);

        ResidentInvitation invitation =
                residentInvitationRepository.findById(invitationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invitation not found"
                                )
                        );

        if (!invitation.getSociety()
                .getId()
                .equals(societyId)) {

            throw new IllegalArgumentException(
                    "Invitation does not belong to this society"
            );
        }

        if (
                invitation.getStatus()
                        != ResidentInvitationStatus.PENDING
        ) {
            throw new IllegalStateException(
                    "Only pending invitations can be cancelled"
            );
        }

        invitation.setStatus(
                ResidentInvitationStatus.CANCELLED
        );

        ResidentInvitation saved =
                residentInvitationRepository.save(
                        invitation
                );

        return toResponse(saved);
    }
    @Transactional(readOnly = true)
    public ResidentInvitationPreviewResponse previewInvitation(
            String rawToken
    ) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException(
                    "Invitation token is required"
            );
        }

        String tokenHash = hashToken(rawToken.trim());

        ResidentInvitation invitation =
                residentInvitationRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid invitation token"
                                )
                        );

        if (invitation.getStatus()
                != ResidentInvitationStatus.PENDING) {

            throw new IllegalStateException(
                    "This invitation is no longer pending"
            );
        }

        if (invitation.getExpiresAt()
                .isBefore(OffsetDateTime.now())) {

            throw new IllegalStateException(
                    "This invitation has expired"
            );
        }

        return new ResidentInvitationPreviewResponse(
                invitation.getId(),
                invitation.getSociety().getId(),
                invitation.getSociety().getName(),
                invitation.getUnit().getId(),
                invitation.getUnit().getUnitNumber(),
                invitation.getUnit().getFloorNumber(),
                invitation.getEmail(),
                invitation.getStatus(),
                invitation.getExpiresAt()
        );
    }

    @Transactional
    public ResidentInvitationResponse acceptInvitation(
            UUID userId,
            AcceptResidentInvitationRequest request
    ) {

        String tokenHash = hashToken(
                request.getToken()
        );

        ResidentInvitation invitation =
                residentInvitationRepository
                        .findByTokenHash(tokenHash)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Invalid invitation token"
                                )
                        );

        if (invitation.getStatus()
                != ResidentInvitationStatus.PENDING) {

            throw new IllegalStateException(
                    "This invitation is no longer pending"
            );
        }

        if (invitation.getExpiresAt()
                .isBefore(OffsetDateTime.now())) {

            invitation.setStatus(
                    ResidentInvitationStatus.EXPIRED
            );

            residentInvitationRepository.save(
                    invitation
            );

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

        if (!user.getEmail()
                .equalsIgnoreCase(invitation.getEmail())) {

            throw new IllegalStateException(
                    "This invitation belongs to a different email address"
            );
        }

        Society society = invitation.getSociety();

        if (society.getStatus() != SocietyStatus.VERIFIED) {
            throw new IllegalStateException(
                    "This society is not currently verified"
            );
        }

        Unit unit = invitation.getUnit();

        if (!unit.getBuilding()
                .getSociety()
                .getId()
                .equals(society.getId())) {

            throw new IllegalStateException(
                    "The invited unit does not belong to this society"
            );
        }

        boolean alreadyMember =
                societyMemberRepository
                        .existsBySocietyIdAndUserId(
                                society.getId(),
                                userId
                        );

        if (alreadyMember) {
            throw new IllegalStateException(
                    "User is already a member of this society"
            );
        }

        SocietyMember member = new SocietyMember();

        member.setSociety(society);
        member.setUser(user);
        member.setUnit(unit);
        member.setRole(SocietyMemberRole.RESIDENT);
        member.setPosition(SocietyPosition.RESIDENT);
        member.setStatus(SocietyMemberStatus.ACTIVE);
        member.setJoinedAt(OffsetDateTime.now());

        societyMemberRepository.save(member);

        invitation.setStatus(
                ResidentInvitationStatus.ACCEPTED
        );

        invitation.setAcceptedAt(
                OffsetDateTime.now()
        );

        ResidentInvitation saved =
                residentInvitationRepository.save(
                        invitation
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
                            rawToken.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            return HexFormat.of().formatHex(hash);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to generate invitation token hash",
                    exception
            );
        }
    }
    private void ensureAdmin(
            UUID societyId,
            UUID adminUserId
    ) {

        boolean isAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRole(
                                societyId,
                                adminUserId,
                                SocietyMemberRole.SOCIETY_ADMIN
                        );

        if (!isAdmin) {
            throw new IllegalStateException(
                    "Only society administrators can manage invitations"
            );
        }
    }

    private ResidentInvitationResponse toResponse(
            ResidentInvitation invitation
    ) {

        return new ResidentInvitationResponse(
                invitation.getId(),
                invitation.getSociety().getId(),
                invitation.getUnit().getId(),
                invitation.getEmail(),
                invitation.getStatus(),
                invitation.getExpiresAt(),
                invitation.getCreatedAt()
        );
    }
}