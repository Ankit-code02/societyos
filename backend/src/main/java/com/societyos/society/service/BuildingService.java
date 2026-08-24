package com.societyos.society.service;

import com.societyos.society.entity.Building;
import com.societyos.society.entity.Society;
import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyMemberStatus;
import com.societyos.society.entity.SocietyStatus;
import com.societyos.society.repository.BuildingRepository;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final SocietyRepository societyRepository;
    private final SocietyMemberRepository societyMemberRepository;

    @Transactional
    public Building createBuilding(
            UUID societyId,
            UUID userId,
            String name,
            String code,
            int floorCount,
            int unitCount
    ) {

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Society not found"
                        )
                );

        if (society.getStatus() != SocietyStatus.VERIFIED) {
            throw new IllegalStateException(
                    "Buildings can only be created for a verified society"
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
                    "Only society administrators can manage buildings"
            );
        }

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(
                    "Building name is required"
            );
        }

        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException(
                    "Building code is required"
            );
        }

        if (floorCount <= 0) {
            throw new IllegalArgumentException(
                    "Floor count must be greater than zero"
            );
        }

        if (unitCount <= 0) {
            throw new IllegalArgumentException(
                    "Unit count must be greater than zero"
            );
        }

        String normalizedCode = code.trim().toUpperCase();

        if (buildingRepository.existsBySocietyIdAndCodeIgnoreCase(
                societyId,
                normalizedCode
        )) {
            throw new IllegalStateException(
                    "A building with this code already exists in the society"
            );
        }

        Building building = new Building();

        building.setSociety(society);
        building.setName(name.trim());
        building.setCode(normalizedCode);
        building.setFloorCount(floorCount);
        building.setUnitCount(unitCount);

        return buildingRepository.save(building);
    }

    @Transactional(readOnly = true)
    public List<Building> getBuildings(
            UUID societyId,
            UUID userId
    ) {

        if (!societyRepository.existsById(societyId)) {
            throw new IllegalArgumentException(
                    "Society not found"
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
                    "Only active society administrators can view buildings"
            );
        }

        return buildingRepository
                .findAllBySocietyIdOrderByCodeAsc(societyId);
    }

    @Transactional(readOnly = true)
    public Building getBuilding(
            UUID societyId,
            UUID buildingId,
            UUID userId
    ) {

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
                    "Only active society administrators can view buildings"
            );
        }

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Building not found"
                        )
                );

        if (!building.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Building does not belong to this society"
            );
        }

        return building;
    }
}