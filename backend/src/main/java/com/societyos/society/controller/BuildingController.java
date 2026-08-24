package com.societyos.society.controller;

import com.societyos.society.dto.BuildingResponse;
import com.societyos.society.dto.CreateBuildingRequest;
import com.societyos.society.entity.Building;
import com.societyos.society.service.BuildingService;
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
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping("/societies/{societyId}/buildings")
    public ResponseEntity<BuildingResponse> createBuilding(
            @PathVariable UUID societyId,
            @Valid @RequestBody CreateBuildingRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Building building = buildingService.createBuilding(
                societyId,
                user.getId(),
                request.getName(),
                request.getCode(),
                request.getFloorCount(),
                request.getUnitCount()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new BuildingResponse(building));
    }

    @GetMapping("/societies/{societyId}/buildings")
    public ResponseEntity<List<BuildingResponse>> getBuildings(
            @PathVariable UUID societyId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        List<BuildingResponse> response =
                buildingService.getBuildings(
                                societyId,
                                user.getId()
                        )
                        .stream()
                        .map(BuildingResponse::new)
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/societies/{societyId}/buildings/{buildingId}")
    public ResponseEntity<BuildingResponse> getBuilding(
            @PathVariable UUID societyId,
            @PathVariable UUID buildingId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        Building building =
                buildingService.getBuilding(
                        societyId,
                        buildingId,
                        user.getId()
                );

        return ResponseEntity.ok(
                new BuildingResponse(building)
        );
    }
}