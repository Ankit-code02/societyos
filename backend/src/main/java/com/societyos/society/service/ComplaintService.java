package com.societyos.society.service;

import com.societyos.society.dto.ComplaintResponse;
import com.societyos.society.dto.CreateComplaintRequest;
import com.societyos.society.entity.*;
import com.societyos.society.repository.ComplaintRepository;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.society.repository.UnitRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.societyos.notification.service.NotificationService;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final NotificationService notificationService;

    @Transactional
    public ComplaintResponse createComplaint(
            UUID societyId,
            UUID userId,
            CreateComplaintRequest request
    ) {

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Society not found"
                        )
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        Unit unit = null;

        if (request.getUnitId() != null) {
            unit = unitRepository.findById(request.getUnitId())
                    .orElseThrow(() ->
                            new IllegalArgumentException(
                                    "Unit not found"
                            )
                    );

            if (!unit.getBuilding().getSociety().getId()
                    .equals(societyId)) {

                throw new IllegalStateException(
                        "Unit does not belong to this society"
                );
            }
        }

        Complaint complaint = new Complaint();

        complaint.setSociety(society);
        complaint.setCreatedBy(user);
        complaint.setUnit(unit);
        complaint.setCategory(request.getCategory());
        complaint.setTitle(request.getTitle().trim());
        complaint.setDescription(request.getDescription().trim());

        complaint.setPriority(
                request.getPriority() != null
                        ? request.getPriority()
                        : ComplaintPriority.MEDIUM
        );

        complaint.setStatus(ComplaintStatus.OPEN);

        Complaint saved = complaintRepository.save(complaint);

        notificationService.createNotification(
                user.getId(),
                "COMPLAINT_CREATED",
                "Complaint submitted",
                "Your complaint \"" + saved.getTitle()
                        + "\" has been submitted successfully."
        );

        return toResponse(saved);
    }
    @Transactional
    public java.util.List<ComplaintResponse> getMyComplaints(UUID userId) {

        return complaintRepository
                .findByCreatedByIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
    @Transactional
    public java.util.List<ComplaintResponse> getSocietyComplaints(
            UUID societyId
    ) {

        return complaintRepository
                .findBySocietyIdOrderByCreatedAtDesc(societyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ComplaintResponse toResponse(Complaint complaint) {

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .societyId(complaint.getSociety().getId())
                .createdBy(complaint.getCreatedBy().getId())
                .createdByEmail(complaint.getCreatedBy().getEmail())
                .unitId(
                        complaint.getUnit() != null
                                ? complaint.getUnit().getId()
                                : null
                )
                .unitNumber(
                        complaint.getUnit() != null
                                ? complaint.getUnit().getUnitNumber()
                                : null
                )
                .category(complaint.getCategory())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .assignedTo(
                        complaint.getAssignedTo() != null
                                ? complaint.getAssignedTo().getId()
                                : null
                )
                .assignedToEmail(
                        complaint.getAssignedTo() != null
                                ? complaint.getAssignedTo().getEmail()
                                : null
                )
                .resolutionNote(complaint.getResolutionNote())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }
    private void requireSocietyAdmin(
            UUID societyId,
            UUID userId
    ) {

        boolean isAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRoleAndStatus(
                                societyId,
                                userId,
                                SocietyMemberRole.SOCIETY_ADMIN,
                                SocietyMemberStatus.ACTIVE
                        );

        if (!isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Society admin access required"
            );
        }
    }
    @Transactional
    public ComplaintResponse assignComplaint(
            UUID societyId,
            UUID userId,
            UUID complaintId,
            UUID assignedToUserId
    ) {
        requireSocietyAdmin(societyId, userId);

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Complaint not found")
                );

        if (!complaint.getSociety().getId().equals(societyId)) {
            throw new IllegalStateException(
                    "Complaint does not belong to this society"
            );
        }

        SocietyMember assignedMember =
                societyMemberRepository
                        .findBySocietyIdAndUserId(
                                societyId,
                                assignedToUserId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Assigned user is not a member of this society"
                                )
                        );

        if (assignedMember.getStatus() != SocietyMemberStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Assigned user is not an active society member"
            );
        }

        User assignedUser = assignedMember.getUser();

        complaint.setAssignedTo(assignedUser);

        Complaint saved = complaintRepository.save(complaint);

        return toResponse(saved);
    }
    @Transactional
    public ComplaintResponse updateComplaintStatus(
            UUID societyId,
            UUID userId,
            UUID complaintId,
            ComplaintStatus newStatus,
            String resolutionNote
    ) {

        requireSocietyAdmin(societyId, userId);

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Complaint not found")
                );

        if (!complaint.getSociety().getId().equals(societyId)) {
            throw new IllegalStateException(
                    "Complaint does not belong to this society"
            );
        }

        ComplaintStatus currentStatus = complaint.getStatus();

        if (currentStatus == ComplaintStatus.CLOSED
                || currentStatus == ComplaintStatus.CANCELLED) {

            throw new IllegalStateException(
                    "Closed or cancelled complaints cannot be updated"
            );
        }

        if (newStatus == ComplaintStatus.RESOLVED) {

            if (resolutionNote == null
                    || resolutionNote.trim().isEmpty()) {

                throw new IllegalArgumentException(
                        "Resolution note is required when resolving a complaint"
                );
            }

            complaint.setResolutionNote(resolutionNote.trim());
            complaint.setResolvedAt(java.time.OffsetDateTime.now());
        }

        if (newStatus != ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(null);
        }

        complaint.setStatus(newStatus);

        Complaint saved = complaintRepository.save(complaint);

        notificationService.createNotification(
                complaint.getCreatedBy().getId(),
                "COMPLAINT_STATUS_UPDATED",
                "Complaint status updated",
                "Your complaint \"" + complaint.getTitle()
                        + "\" is now "
                        + newStatus.name().toLowerCase()
                        + "."
        );

        return toResponse(saved);
    }
}