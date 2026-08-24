package com.societyos.society.service;

import com.societyos.society.entity.Building;
import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyStatus;
import com.societyos.society.entity.Unit;
import com.societyos.society.repository.BuildingRepository;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.UnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.society.entity.SocietyMemberStatus;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UnitService {

    private final UnitRepository unitRepository;
    private final BuildingRepository buildingRepository;
    private final SocietyMemberRepository societyMemberRepository;

    @Transactional
    public Unit createUnit(
            UUID societyId,
            UUID buildingId,
            UUID userId,
            String unitNumber,
            int floorNumber,
            String unitType,
            String status
    ) {

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Building not found")
                );

        if (!building.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Building does not belong to this society"
            );
        }

        if (building.getSociety().getStatus() != SocietyStatus.VERIFIED) {
            throw new IllegalStateException(
                    "Units can only be created for a verified society"
            );
        }

        boolean isSocietyAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRoleAndStatus(
                                societyId,
                                userId,
                                SocietyMemberRole.SOCIETY_ADMIN,
                                SocietyMemberStatus.ACTIVE
                        );

        if (!isSocietyAdmin) {
            throw new IllegalStateException(
                    "Only active society administrators can manage units"
            );
        }

        if (unitNumber == null || unitNumber.isBlank()) {
            throw new IllegalArgumentException(
                    "Unit number is required"
            );
        }

        if (floorNumber < 0) {
            throw new IllegalArgumentException(
                    "Floor number cannot be negative"
            );
        }

        if (unitType == null || unitType.isBlank()) {
            throw new IllegalArgumentException(
                    "Unit type is required"
            );
        }

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Unit status is required"
            );
        }

        String normalizedUnitNumber =
                unitNumber.trim().toUpperCase();

        if (unitRepository.existsByBuildingIdAndUnitNumberIgnoreCase(
                buildingId,
                normalizedUnitNumber
        )) {
            throw new IllegalStateException(
                    "A unit with this number already exists in the building"
            );
        }

        Unit unit = new Unit();

        unit.setBuilding(building);
        unit.setUnitNumber(normalizedUnitNumber);
        unit.setFloorNumber(floorNumber);
        unit.setUnitType(unitType.trim().toUpperCase());
        unit.setStatus(status.trim().toUpperCase());

        return unitRepository.save(unit);
    }

    @Transactional(readOnly = true)
    public List<Unit> getUnits(
            UUID societyId,
            UUID buildingId,
            UUID userId
    ) {

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Building not found")
                );

        if (!building.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Building does not belong to this society"
            );
        }

        boolean isSocietyAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRoleAndStatus(
                                societyId,
                                userId,
                                SocietyMemberRole.SOCIETY_ADMIN,
                                SocietyMemberStatus.ACTIVE
                        );

        if (!isSocietyAdmin) {
            throw new IllegalStateException(
                    "Only active society administrators can manage units"
            );
        }

        return unitRepository
                .findAllByBuildingIdOrderByFloorNumberAscUnitNumberAsc(
                        buildingId
                );
    }

    @Transactional(readOnly = true)
    public Unit getUnit(
            UUID societyId,
            UUID buildingId,
            UUID unitId,
            UUID userId
    ) {

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Building not found")
                );

        if (!building.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Building does not belong to this society"
            );
        }

        boolean isSocietyAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRoleAndStatus(
                                societyId,
                                userId,
                                SocietyMemberRole.SOCIETY_ADMIN,
                                SocietyMemberStatus.ACTIVE
                        );

        if (!isSocietyAdmin) {
            throw new IllegalStateException(
                    "Only active society administrators can manage units"
            );
        }

        Unit unit = unitRepository.findById(unitId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Unit not found")
                );

        if (!unit.getBuilding().getId().equals(buildingId)) {
            throw new IllegalArgumentException(
                    "Unit does not belong to this building"
            );
        }

        return unit;
    }
}