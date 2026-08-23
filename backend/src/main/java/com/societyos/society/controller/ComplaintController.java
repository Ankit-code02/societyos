package com.societyos.society.controller;

import com.societyos.society.dto.AssignComplaintRequest;
import com.societyos.society.dto.ComplaintResponse;
import com.societyos.society.dto.CreateComplaintRequest;
import com.societyos.society.dto.UpdateComplaintStatusRequest;
import com.societyos.society.service.ComplaintService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/societies/{societyId}/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ComplaintResponse> createComplaint(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateComplaintRequest request,
            Authentication authentication
    ) {
        User user =
                (User) authentication.getPrincipal();

        ComplaintResponse response =
                complaintService.createComplaint(
                        societyId,
                        user.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {
        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                complaintService.getMyComplaints(
                        user.getId()
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getSocietyComplaints(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {
        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                complaintService.getSocietyComplaints(
                        societyId
                )
        );
    }

    @PutMapping("/{complaintId}/assign")
    public ResponseEntity<ComplaintResponse> assignComplaint(
            @PathVariable UUID societyId,
            @PathVariable UUID complaintId,
            @Valid @RequestBody AssignComplaintRequest request,
            Authentication authentication
    ) {
        User user =
                (User) authentication.getPrincipal();

        ComplaintResponse response =
                complaintService.assignComplaint(
                        societyId,
                        user.getId(),
                        complaintId,
                        request.getAssignedTo()
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateComplaintStatus(
            @PathVariable UUID societyId,
            @PathVariable UUID complaintId,
            @Valid @RequestBody UpdateComplaintStatusRequest request,
            Authentication authentication
    ) {
        User user =
                (User) authentication.getPrincipal();

        ComplaintResponse response =
                complaintService.updateComplaintStatus(
                        societyId,
                        user.getId(),
                        complaintId,
                        request.getStatus(),
                        request.getResolutionNote()
                );

        return ResponseEntity.ok(response);
    }
}