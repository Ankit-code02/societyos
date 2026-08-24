package com.societyos.society.controller;

import com.societyos.society.dto.AnnouncementResponse;
import com.societyos.society.dto.CreateAnnouncementRequest;
import com.societyos.society.service.AnnouncementService;
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
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping("/{societyId}/announcements")
    public AnnouncementResponse createAnnouncement(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateAnnouncementRequest request,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return announcementService.createAnnouncement(
                societyId,
                user.getId(),
                request
        );
    }

    @PostMapping("/{societyId}/announcements/{announcementId}/publish")
    public AnnouncementResponse publishAnnouncement(
            @PathVariable UUID societyId,
            @PathVariable UUID announcementId,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return announcementService.publishAnnouncement(
                societyId,
                user.getId(),
                announcementId
        );
    }

    @GetMapping("/{societyId}/announcements")
    public List<AnnouncementResponse> getAllAnnouncements(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return announcementService.getAllAnnouncements(
                societyId,
                user.getId()
        );
    }

    @GetMapping("/{societyId}/announcements/published")
    public List<AnnouncementResponse> getPublishedAnnouncements(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return announcementService.getPublishedAnnouncements(
                societyId,
                user.getId()
        );
    }
}
