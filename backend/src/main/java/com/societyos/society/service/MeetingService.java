package com.societyos.society.service;

import com.societyos.society.dto.CreateMeetingRequest;
import com.societyos.society.dto.MeetingResponse;
import com.societyos.society.entity.Meeting;
import com.societyos.society.entity.MeetingStatus;
import com.societyos.society.entity.Society;
import com.societyos.society.repository.MeetingRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.notification.service.NotificationService;
import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyMemberStatus;
import com.societyos.society.repository.SocietyMemberRepository;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final SocietyRepository societyRepository;
    private final UserRepository userRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final NotificationService notificationService;

    @Transactional
    public MeetingResponse createMeeting(
            UUID societyId,
            UUID userId,
            CreateMeetingRequest request
    ) {

        requireSocietyAdmin(societyId, userId);
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Society not found"
                ));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"
                ));

        Meeting meeting = new Meeting();

        meeting.setSociety(society);
        meeting.setCreatedBy(user);
        meeting.setTitle(request.title());
        meeting.setDescription(request.description());
        meeting.setScheduledAt(request.scheduledAt());
        meeting.setVenue(request.venue());
        meeting.setStatus(MeetingStatus.SCHEDULED);

        Meeting savedMeeting = meetingRepository.save(meeting);
        societyMemberRepository
                .findAllBySocietyIdOrderByCreatedAtAsc(societyId)
                .forEach(member -> {

                    if (!member.getUser().getId().equals(userId)
                            && member.getStatus() == SocietyMemberStatus.ACTIVE) {
                        notificationService.createNotification(
                                member.getUser().getId(),
                                "MEETING_CREATED",
                                "New society meeting",
                                "A new meeting \"" + savedMeeting.getTitle()
                                        + "\" has been scheduled for "
                                        + savedMeeting.getScheduledAt()
                                        + "."
                        );
                    }
                });

        return toResponse(savedMeeting);
    }

    @Transactional(readOnly = true)
    public List<MeetingResponse> getSocietyMeetings(
            UUID societyId,
            UUID userId
    ) {

        requireActiveSocietyMember(
                societyId,
                userId
        );

        return meetingRepository
                .findBySocietyIdOrderByScheduledAtDesc(societyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MeetingResponse> getUpcomingMeetings(
            UUID societyId,
            UUID userId
    ) {

        requireActiveSocietyMember(
                societyId,
                userId
        );

        return meetingRepository
                .findBySocietyIdAndStatusOrderByScheduledAtAsc(
                        societyId,
                        MeetingStatus.SCHEDULED
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public MeetingResponse cancelMeeting(
            UUID societyId,
            UUID userId,
            UUID meetingId
    ) {
        requireSocietyAdmin(societyId, userId);
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Meeting not found"
                ));

        if (!meeting.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Meeting does not belong to this society"
            );
        }

        meeting.setStatus(MeetingStatus.CANCELLED);

        Meeting savedMeeting = meetingRepository.save(meeting);

        societyMemberRepository
                .findAllBySocietyIdOrderByCreatedAtAsc(societyId)
                .forEach(member -> {

                    if (!member.getUser().getId().equals(userId)
                            && member.getStatus() == SocietyMemberStatus.ACTIVE) {
                        notificationService.createNotification(
                                member.getUser().getId(),
                                "MEETING_CANCELLED",
                                "Meeting cancelled",
                                "The meeting \"" + savedMeeting.getTitle()
                                        + "\" has been cancelled."
                        );
                    }
                });

        return toResponse(savedMeeting);
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
                    "Society admin access required"
            );
        }
    }

    private MeetingResponse toResponse(Meeting meeting) {

        return new MeetingResponse(
                meeting.getId(),
                meeting.getSociety().getId(),
                meeting.getCreatedBy().getId(),
                meeting.getCreatedBy().getEmail(),
                meeting.getTitle(),
                meeting.getDescription(),
                meeting.getScheduledAt(),
                meeting.getVenue(),
                meeting.getStatus(),
                meeting.getCreatedAt(),
                meeting.getUpdatedAt()
        );
    }
}