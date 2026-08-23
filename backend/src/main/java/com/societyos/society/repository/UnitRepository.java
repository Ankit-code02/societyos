package com.societyos.society.repository;

import com.societyos.society.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UnitRepository extends JpaRepository<Unit, UUID> {

    List<Unit> findAllByBuildingIdOrderByFloorNumberAscUnitNumberAsc(
            UUID buildingId
    );

    boolean existsByBuildingIdAndUnitNumberIgnoreCase(
            UUID buildingId,
            String unitNumber
    );
}