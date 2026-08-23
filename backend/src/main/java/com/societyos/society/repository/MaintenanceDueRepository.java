package com.societyos.society.repository;

import com.societyos.society.entity.MaintenanceDue;
import com.societyos.society.entity.MaintenanceDueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MaintenanceDueRepository
        extends JpaRepository<MaintenanceDue, UUID> {

    List<MaintenanceDue> findBySocietyIdOrderByDueDateAsc(UUID societyId);

    List<MaintenanceDue> findByUnitIdOrderByDueDateAsc(UUID unitId);

    List<MaintenanceDue> findBySocietyIdAndStatusOrderByDueDateAsc(
            UUID societyId,
            MaintenanceDueStatus status
    );
}