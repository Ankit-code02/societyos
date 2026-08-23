package com.societyos.society.service;

import com.societyos.society.dto.SubmitVerificationResponse;
import com.societyos.society.dto.UploadVerificationDocumentRequest;
import com.societyos.society.dto.VerificationDocumentResponse;
import com.societyos.society.entity.*;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.society.repository.SocietyVerificationDocumentRepository;
import com.societyos.society.repository.SocietyVerificationRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.auth.entity.RoleCode;
import com.societyos.society.dto.ReviewDecision;
import com.societyos.society.dto.ReviewVerificationRequest;
import com.societyos.society.dto.ReviewVerificationResponse;
import com.societyos.auth.repository.UserRoleRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocietyVerificationService {

    private final SocietyRepository societyRepository;
    private final SocietyVerificationRepository societyVerificationRepository;
    private final SocietyVerificationDocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final SocietyMemberRepository societyMemberRepository;

    @Transactional
    public VerificationDocumentResponse uploadDocument(
            UUID authenticatedUserId,
            UUID societyId,
            UploadVerificationDocumentRequest request
    ) {

        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Society not found"
                        )
                );

        SocietyVerification verification =
                societyVerificationRepository
                        .findBySocietyId(societyId)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Society verification not found"
                                )
                        );

        if (!verification.getApplicant().getId()
                .equals(user.getId())) {

            throw new IllegalStateException(
                    "Only the verification applicant can upload documents"
            );
        }

        if (verification.getStatus()
                != SocietyVerificationStatus.PENDING) {

            throw new IllegalStateException(
                    "Documents can only be uploaded while verification is pending"
            );
        }

        SocietyVerificationDocument document =
                new SocietyVerificationDocument();

        document.setVerification(verification);
        document.setDocumentType(request.getDocumentType());
        document.setFileName(request.getFileName().trim());
        document.setStorageKey(request.getStorageKey().trim());

        SocietyVerificationDocument savedDocument =
                documentRepository.save(document);

        return new VerificationDocumentResponse(
                savedDocument.getId(),
                verification.getId(),
                savedDocument.getDocumentType(),
                savedDocument.getFileName(),
                savedDocument.getUploadedAt(),
                "Verification document uploaded successfully."
        );
    }
    @Transactional
    public SubmitVerificationResponse submitVerification(
            UUID authenticatedUserId,
            UUID societyId
    ) {

        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Society not found"
                        )
                );

        SocietyVerification verification =
                societyVerificationRepository
                        .findBySocietyId(societyId)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Society verification not found"
                                )
                        );

        if (!verification.getApplicant().getId()
                .equals(user.getId())) {

            throw new IllegalStateException(
                    "Only the verification applicant can submit the verification"
            );
        }

        if (verification.getStatus()
                != SocietyVerificationStatus.PENDING) {

            throw new IllegalStateException(
                    "Only pending verification can be submitted"
            );
        }

        var documents =
                documentRepository.findByVerificationId(
                        verification.getId()
                );

        if (documents.isEmpty()) {

            throw new IllegalStateException(
                    "At least one verification document is required before submission"
            );
        }

        verification.setStatus(
                SocietyVerificationStatus.UNDER_REVIEW
        );

        verification.setSubmittedAt(
                java.time.OffsetDateTime.now()
        );

// Demo verification:
// Automatically approve the society after submission.
// In a production system this would be replaced with
// an actual verification workflow.
        verification.setStatus(
                SocietyVerificationStatus.APPROVED
        );

        society.setStatus(
                SocietyStatus.VERIFIED
        );

        verification.setRejectionReason(null);

        boolean memberExists =
                societyMemberRepository.existsBySocietyIdAndUserId(
                        societyId,
                        verification.getApplicant().getId()
                );

        if (!memberExists) {

            SocietyMember member = new SocietyMember();

            member.setSociety(society);
            member.setUser(verification.getApplicant());
            member.setRole(SocietyMemberRole.SOCIETY_ADMIN);
            member.setPosition(
                    SocietyPosition.valueOf(
                            verification.getClaimedPosition().name()
                    )
            );
            member.setStatus(SocietyMemberStatus.ACTIVE);
            member.setJoinedAt(
                    java.time.OffsetDateTime.now()
            );

            societyMemberRepository.save(member);
        }

        societyRepository.save(society);

        SocietyVerification savedVerification =
                societyVerificationRepository.save(
                        verification
                );

        return new SubmitVerificationResponse(
                society.getId(),
                savedVerification.getId(),
                savedVerification.getStatus(),
                savedVerification.getSubmittedAt(),
                "Society verification completed successfully."
        );
    }
    @Transactional
    public ReviewVerificationResponse reviewVerification(
            UUID reviewerId,
            UUID societyId,
            ReviewVerificationRequest request
    ) {

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Reviewer not found"
                        )
                );

        boolean isSuperAdmin = userRoleRepository
                .existsByUserIdAndRoleCode(
                        reviewerId,
                        RoleCode.SUPER_ADMIN
                );

        if (!isSuperAdmin) {
            throw new IllegalStateException(
                    "Only SUPER_ADMIN can review society verification"
            );
        }

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Society not found"
                        )
                );

        SocietyVerification verification =
                societyVerificationRepository
                        .findBySocietyId(societyId)
                        .orElseThrow(() ->
                                new IllegalStateException(
                                        "Society verification not found"
                                )
                        );

        if (verification.getStatus()
                != SocietyVerificationStatus.UNDER_REVIEW) {

            throw new IllegalStateException(
                    "Only verification applications under review can be reviewed"
            );
        }

        if (request.getDecision() == ReviewDecision.APPROVE) {

            verification.setStatus(
                    SocietyVerificationStatus.APPROVED
            );

            society.setStatus(
                    SocietyStatus.VERIFIED
            );

            verification.setRejectionReason(null);

            boolean memberExists =
                    societyMemberRepository.existsBySocietyIdAndUserId(
                            societyId,
                            verification.getApplicant().getId()
                    );

            if (!memberExists) {

                SocietyMember member = new SocietyMember();

                member.setSociety(society);
                member.setUser(verification.getApplicant());
                member.setRole(SocietyMemberRole.SOCIETY_ADMIN);
                member.setPosition(
                        SocietyPosition.valueOf(
                                verification.getClaimedPosition().name()
                        )
                );
                member.setStatus(SocietyMemberStatus.ACTIVE);
                member.setJoinedAt(
                        java.time.OffsetDateTime.now()
                );

                societyMemberRepository.save(member);
            }
        } else {

            if (request.getRejectionReason() == null
                    || request.getRejectionReason().isBlank()) {

                throw new IllegalArgumentException(
                        "Rejection reason is required"
                );
            }

            verification.setStatus(
                    SocietyVerificationStatus.REJECTED
            );

            verification.setRejectionReason(
                    request.getRejectionReason().trim()
            );
        }

        verification.setReviewedBy(reviewer);
        verification.setReviewedAt(
                java.time.OffsetDateTime.now()
        );

        societyRepository.save(society);

        SocietyVerification savedVerification =
                societyVerificationRepository.save(
                        verification
                );

        String message =
                request.getDecision() == ReviewDecision.APPROVE
                        ? "Society verification approved successfully."
                        : "Society verification rejected successfully.";

        return new ReviewVerificationResponse(
                society.getId(),
                savedVerification.getId(),
                savedVerification.getStatus(),
                society.getStatus(),
                reviewer.getId(),
                savedVerification.getReviewedAt(),
                message
        );
    }
}