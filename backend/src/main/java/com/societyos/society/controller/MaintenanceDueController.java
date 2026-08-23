package com.societyos.society.controller;

import com.societyos.society.dto.CreateMaintenanceDueRequest;
import com.societyos.society.dto.MaintenanceDueResponse;
import com.societyos.society.entity.MaintenanceDue;
import com.societyos.society.service.MaintenanceDueService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.societyos.society.dto.DemoPaymentResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/societies")
@RequiredArgsConstructor
public class MaintenanceDueController {

    private final MaintenanceDueService maintenanceDueService;

    @PostMapping("/{societyId}/maintenance-dues")
    public MaintenanceDueResponse createDue(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateMaintenanceDueRequest request,
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        UUID authenticatedUserId =
                authenticatedUser.getId();

        return maintenanceDueService.createDue(
                societyId,
                authenticatedUserId,
                request
        );
    }

    @GetMapping("/{societyId}/maintenance-dues")
    public List<MaintenanceDueResponse> getSocietyDues(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        return maintenanceDueService.getSocietyDues(
                societyId
        );
    }

    @GetMapping("/{societyId}/units/{unitId}/maintenance-dues")
    public List<MaintenanceDueResponse> getUnitDues(
            @PathVariable UUID societyId,
            @PathVariable UUID unitId,
            Authentication authentication
    ) {

        return maintenanceDueService.getUnitDues(
                societyId,
                unitId
        );
    }
    @PostMapping("/{societyId}/maintenance-dues/{dueId}/demo-pay")
    public DemoPaymentResponse makeDemoPayment(
            @PathVariable UUID societyId,
            @PathVariable UUID dueId,
            Authentication authentication
    ) {
        User authenticatedUser =
                (User) authentication.getPrincipal();

        return maintenanceDueService.makeDemoPayment(
                societyId,
                authenticatedUser.getId(),
                dueId
        );
    }
    @PutMapping("/{societyId}/maintenance-dues/{dueId}/pay")
    public MaintenanceDueResponse markAsPaid(
            @PathVariable UUID societyId,
            @PathVariable UUID dueId,
            Authentication authentication
    ) {

        User authenticatedUser =
                (User) authentication.getPrincipal();

        UUID authenticatedUserId =
                authenticatedUser.getId();

        return maintenanceDueService.markAsPaid(
                societyId,
                authenticatedUserId,
                dueId
        );
    }
}