package com.societyos.society.service;

import com.societyos.society.dto.AnnouncementResponse;
import com.societyos.society.dto.CreateAnnouncementRequest;
import com.societyos.society.entity.AnnouncementStatus;
import com.societyos.society.entity.Society;
import com.societyos.society.entity.SocietyAnnouncement;
import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyMemberStatus;
import com.societyos.society.repository.SocietyAnnouncementRepository;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final SocietyAnnouncementRepository announcementRepository;
    private final SocietyRepository societyRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public AnnouncementResponse createAnnouncement(
            UUID societyId,
            UUID userId,
            CreateAnnouncementRequest request
    ) {

        requireSocietyAdmin(societyId, userId);

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Society not found")
                );

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        SocietyAnnouncement announcement = new SocietyAnnouncement();

        announcement.setSociety(society);
        announcement.setCreatedBy(user);
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setCategory(request.getCategory());
        announcement.setStatus(AnnouncementStatus.DRAFT);

        announcement = announcementRepository.save(announcement);

        return toResponse(announcement);
    }

    @Transactional
    public AnnouncementResponse publishAnnouncement(
            UUID societyId,
            UUID userId,
            UUID announcementId
    ) {

        requireSocietyAdmin(societyId, userId);

        SocietyAnnouncement announcement =
                announcementRepository.findById(announcementId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Announcement not found"
                                )
                        );

        if (!announcement.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Announcement does not belong to this society"
            );
        }

        if (announcement.getStatus() == AnnouncementStatus.PUBLISHED) {
            throw new IllegalArgumentException(
                    "Announcement is already published"
            );
        }

        announcement.setStatus(AnnouncementStatus.PUBLISHED);
        announcement.setPublishedAt(OffsetDateTime.now());

        announcement = announcementRepository.save(announcement);

        return toResponse(announcement);
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getAllAnnouncements(
            UUID societyId,
            UUID userId
    ) {

        requireSocietyAdmin(societyId, userId);

        return announcementRepository
                .findBySocietyIdOrderByCreatedAtDesc(societyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AnnouncementResponse> getPublishedAnnouncements(
            UUID societyId,
            UUID userId
    ) {

        requireActiveSocietyMember(
                societyId,
                userId
        );

        return announcementRepository
                .findBySocietyIdAndStatusOrderByCreatedAtDesc(
                        societyId,
                        AnnouncementStatus.PUBLISHED
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }
    private void requireActiveSocietyMember(
            UUID societyId,
            UUID userId
    ) {

        var member =
                societyMemberRepository
                        .findBySocietyIdAndUserId(
                                societyId,
                                userId
                        )
                        .orElseThrow(() ->
                                new AccessDeniedException(
                                        "Society membership required"
                                )
                        );

        if (member.getStatus() != SocietyMemberStatus.ACTIVE) {
            throw new AccessDeniedException(
                    "Active society membership required"
            );
        }
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
            throw new AccessDeniedException(
                    "Only active society admins can perform this action"
            );
        }
    }

    private AnnouncementResponse toResponse(
            SocietyAnnouncement announcement
    ) {

        return new AnnouncementResponse(
                announcement.getId(),
                announcement.getSociety().getId(),
                announcement.getCreatedBy().getId(),
                announcement.getCreatedBy().getEmail(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCategory(),
                announcement.getStatus().name(),
                announcement.getPublishedAt(),
                announcement.getCreatedAt(),
                announcement.getUpdatedAt()
        );
    }
}