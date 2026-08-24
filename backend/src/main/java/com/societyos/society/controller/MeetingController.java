package com.societyos.society.controller;

import com.societyos.society.dto.CreateMeetingRequest;
import com.societyos.society.dto.MeetingResponse;
import com.societyos.society.service.MeetingService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping("/{societyId}/meetings")
    public MeetingResponse createMeeting(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateMeetingRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return meetingService.createMeeting(
                societyId,
                user.getId(),
                request
        );
    }

    @GetMapping("/{societyId}/meetings")
    public List<MeetingResponse> getSocietyMeetings(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return meetingService.getSocietyMeetings(
                societyId,
                user.getId()
        );
    }

    @GetMapping("/{societyId}/meetings/upcoming")
    public List<MeetingResponse> getUpcomingMeetings(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return meetingService.getUpcomingMeetings(
                societyId,
                user.getId()
        );
    }

    @PutMapping("/{societyId}/meetings/{meetingId}/cancel")
    public MeetingResponse cancelMeeting(
            @PathVariable UUID societyId,
            @PathVariable UUID meetingId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return meetingService.cancelMeeting(
                societyId,
                user.getId(),
                meetingId
        );
    }
}