package com.societyos.society.repository;

import com.societyos.society.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BuildingRepository extends JpaRepository<Building, UUID> {

    List<Building> findAllBySocietyIdOrderByCodeAsc(UUID societyId);

    boolean existsBySocietyIdAndCodeIgnoreCase(
            UUID societyId,
            String code
    );
}