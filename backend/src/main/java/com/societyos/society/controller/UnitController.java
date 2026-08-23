package com.societyos.society.controller;

import com.societyos.society.dto.CreateUnitRequest;
import com.societyos.society.dto.UnitResponse;
import com.societyos.society.entity.Unit;
import com.societyos.society.service.UnitService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UnitController {

    private final UnitService unitService;

    @PostMapping(
            "/societies/{societyId}/buildings/{buildingId}/units"
    )
    public ResponseEntity<UnitResponse> createUnit(
            @PathVariable UUID societyId,
            @PathVariable UUID buildingId,
            @Valid @RequestBody CreateUnitRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        Unit unit =
                unitService.createUnit(
                        buildingId,
                        user.getId(),
                        request.getUnitNumber(),
                        request.getFloorNumber(),
                        request.getUnitType(),
                        request.getStatus()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new UnitResponse(unit));
    }

    @GetMapping(
            "/societies/{societyId}/buildings/{buildingId}/units"
    )
    public ResponseEntity<List<UnitResponse>> getUnits(
            @PathVariable UUID societyId,
            @PathVariable UUID buildingId
    ) {

        List<UnitResponse> response =
                unitService.getUnits(
                                societyId,
                                buildingId
                        )
                        .stream()
                        .map(UnitResponse::new)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping(
            "/societies/{societyId}/buildings/{buildingId}/units/{unitId}"
    )
    public ResponseEntity<UnitResponse> getUnit(
            @PathVariable UUID societyId,
            @PathVariable UUID buildingId,
            @PathVariable UUID unitId
    ) {

        Unit unit =
                unitService.getUnit(
                        societyId,
                        buildingId,
                        unitId
                );

        return ResponseEntity.ok(
                new UnitResponse(unit)
        );
    }
}