package com.societyos.society.service;

import com.societyos.society.dto.CreateMaintenanceDueRequest;
import com.societyos.society.dto.MaintenanceDueResponse;
import com.societyos.society.entity.MaintenanceDue;
import com.societyos.society.entity.MaintenanceDueStatus;
import com.societyos.society.entity.Society;
import com.societyos.society.entity.Unit;
import com.societyos.society.repository.MaintenanceDueRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.society.repository.UnitRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.society.entity.SocietyMemberRole;
import com.societyos.society.entity.SocietyMemberStatus;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.dto.DemoPaymentResponse;
import com.societyos.user.entity.User;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MaintenanceDueService {

    private final MaintenanceDueRepository maintenanceDueRepository;
    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;
    private final SocietyMemberRepository societyMemberRepository;

    @Transactional
    public MaintenanceDueResponse createDue(
            UUID societyId,
            UUID userId,
            CreateMaintenanceDueRequest request
    ) {
        verifySocietyAdmin(societyId, userId);
        Society society = societyRepository.findById(societyId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Society not found"
                ));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"
                ));

        Unit unit = unitRepository.findById(request.unitId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unit not found"
                ));

        if (!unit.getBuilding().getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Unit does not belong to this society"
            );
        }

        MaintenanceDue due = new MaintenanceDue();

        due.setSociety(society);
        due.setUnit(unit);
        due.setCreatedBy(user);
        due.setTitle(request.title());
        due.setDescription(request.description());
        due.setAmount(request.amount());
        due.setDueDate(request.dueDate());
        due.setStatus(MaintenanceDueStatus.PENDING);

        return toResponse(maintenanceDueRepository.save(due));
    }

    @Transactional(readOnly = true)
    public List<MaintenanceDueResponse> getSocietyDues(
            UUID societyId
    ) {
        return maintenanceDueRepository
                .findBySocietyIdOrderByDueDateAsc(societyId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MaintenanceDueResponse> getUnitDues(
            UUID societyId,
            UUID unitId
    ) {
        Unit unit = unitRepository.findById(unitId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unit not found"
                ));

        if (!unit.getBuilding().getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Unit does not belong to this society"
            );
        }

        return maintenanceDueRepository
                .findByUnitIdOrderByDueDateAsc(unitId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
    @Transactional
    public DemoPaymentResponse makeDemoPayment(
            UUID societyId,
            UUID userId,
            UUID dueId
    ) {
        MaintenanceDue due = maintenanceDueRepository.findById(dueId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Maintenance due not found"
                ));

        if (!due.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Maintenance due does not belong to this society"
            );
        }

        if (!due.getUnit().getId().equals(
                societyMemberRepository
                        .findBySocietyIdAndUserId(societyId, userId)
                        .orElseThrow(() -> new IllegalArgumentException(
                                "User is not a member of this society"
                        ))
                        .getUnit()
                        .getId()
        )) {
            throw new IllegalArgumentException(
                    "Maintenance due does not belong to the user's unit"
            );
        }

        if (due.getStatus() == MaintenanceDueStatus.PAID) {
            throw new IllegalStateException(
                    "Maintenance due is already paid"
            );
        }

        due.setStatus(MaintenanceDueStatus.PAID);
        due.setPaidAt(OffsetDateTime.now());

        MaintenanceDue savedDue =
                maintenanceDueRepository.save(due);

        UUID paymentId = UUID.randomUUID();

        String transactionReference =
                "DEMO-" +
                        paymentId.toString()
                                .replace("-", "")
                                .substring(0, 12)
                                .toUpperCase();

        return new DemoPaymentResponse(
                paymentId,
                savedDue.getId(),
                savedDue.getAmount(),
                "SUCCESS",
                transactionReference,
                savedDue.getPaidAt(),
                "Demo payment completed successfully"
        );
    }

    @Transactional
    public MaintenanceDueResponse markAsPaid(
            UUID societyId,
            UUID userId,
            UUID dueId
    ) {
        verifySocietyAdmin(societyId, userId);
        MaintenanceDue due = maintenanceDueRepository.findById(dueId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Maintenance due not found"
                ));

        if (!due.getSociety().getId().equals(societyId)) {
            throw new IllegalArgumentException(
                    "Maintenance due does not belong to this society"
            );
        }

        if (due.getStatus() == MaintenanceDueStatus.PAID) {
            throw new IllegalStateException(
                    "Maintenance due is already paid"
            );
        }

        due.setStatus(MaintenanceDueStatus.PAID);
        due.setPaidAt(OffsetDateTime.now());

        return toResponse(maintenanceDueRepository.save(due));
    }
    private void verifySocietyAdmin(
            UUID societyId,
            UUID userId
    ) {
        boolean isAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRoleAndStatus(
                                societyId,
                                userId,
                                SocietyMemberRole.SOCIETY_ADMIN,
                                SocietyMemberStatus.ACTIVE
                        );

        if (!isAdmin) {
            throw new IllegalArgumentException(
                    "User is not an active society admin"
            );
        }
    }

    private MaintenanceDueResponse toResponse(MaintenanceDue due) {
        return new MaintenanceDueResponse(
                due.getId(),
                due.getSociety().getId(),
                due.getUnit().getId(),
                due.getUnit().getUnitNumber(),
                due.getCreatedBy().getId(),
                due.getCreatedBy().getEmail(),
                due.getTitle(),
                due.getDescription(),
                due.getAmount(),
                due.getDueDate(),
                due.getStatus(),
                due.getPaidAt(),
                due.getCreatedAt(),
                due.getUpdatedAt()
        );
    }
}