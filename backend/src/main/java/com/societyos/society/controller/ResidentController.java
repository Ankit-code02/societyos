package com.societyos.society.controller;

import com.societyos.society.dto.ChangeResidentUnitRequest;
import com.societyos.society.dto.ResidentResponse;
import com.societyos.society.entity.SocietyMember;
import com.societyos.society.service.ResidentService;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ResidentController {

    private final ResidentService residentService;

    @GetMapping("/societies/{societyId}/residents")
    public ResponseEntity<List<ResidentResponse>> getResidents(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        List<ResidentResponse> residents =
                residentService.getResidents(
                        societyId,
                        admin.getId()
                );

        return ResponseEntity.ok(residents);
    }

    @PostMapping("/societies/{societyId}/residents")
    public ResponseEntity<ResidentResponse> addResident(
            @PathVariable UUID societyId,
            @RequestParam UUID residentUserId,
            @RequestParam UUID unitId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        SocietyMember member =
                residentService.addResident(
                        societyId,
                        admin.getId(),
                        residentUserId,
                        unitId
                );

        return ResponseEntity.ok(
                new ResidentResponse(member)
        );
    }

    @PatchMapping(
            "/societies/{societyId}/residents/{memberId}/unit"
    )
    public ResponseEntity<ResidentResponse> changeUnit(
            @PathVariable UUID societyId,
            @PathVariable UUID memberId,
            @Valid @RequestBody ChangeResidentUnitRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        SocietyMember member =
                residentService.changeUnit(
                        societyId,
                        admin.getId(),
                        memberId,
                        request.getUnitId()
                );

        return ResponseEntity.ok(
                new ResidentResponse(member)
        );
    }

    @PatchMapping(
            "/societies/{societyId}/residents/{memberId}/suspend"
    )
    public ResponseEntity<ResidentResponse> suspendResident(
            @PathVariable UUID societyId,
            @PathVariable UUID memberId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        SocietyMember member =
                residentService.suspendResident(
                        societyId,
                        admin.getId(),
                        memberId
                );

        return ResponseEntity.ok(
                new ResidentResponse(member)
        );
    }

    @PatchMapping(
            "/societies/{societyId}/residents/{memberId}/reactivate"
    )
    public ResponseEntity<ResidentResponse> reactivateResident(
            @PathVariable UUID societyId,
            @PathVariable UUID memberId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        SocietyMember member =
                residentService.reactivateResident(
                        societyId,
                        admin.getId(),
                        memberId
                );

        return ResponseEntity.ok(
                new ResidentResponse(member)
        );
    }

    @DeleteMapping(
            "/societies/{societyId}/residents/{memberId}"
    )
    public ResponseEntity<ResidentResponse> removeResident(
            @PathVariable UUID societyId,
            @PathVariable UUID memberId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        SocietyMember member =
                residentService.removeResident(
                        societyId,
                        admin.getId(),
                        memberId
                );

        return ResponseEntity.ok(
                new ResidentResponse(member)
        );
    }
}