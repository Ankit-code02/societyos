package com.societyos.society.service;

import com.societyos.society.dto.ResidentResponse;
import com.societyos.society.entity.*;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.society.repository.UnitRepository;
import com.societyos.user.entity.User;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResidentService {

    private final SocietyMemberRepository societyMemberRepository;
    private final SocietyRepository societyRepository;
    private final UnitRepository unitRepository;
    private final UserRepository userRepository;

    @Transactional
    public SocietyMember addResident(
            UUID societyId,
            UUID adminUserId,
            UUID residentUserId,
            UUID unitId
    ) {

        Society society = societyRepository.findById(societyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Society not found")
                );

        ensureAdmin(societyId, adminUserId);

        if (society.getStatus() != SocietyStatus.VERIFIED) {
            throw new IllegalStateException(
                    "Residents can only be added to a verified society"
            );
        }

        User residentUser = userRepository.findById(residentUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Resident user not found")
                );

        if (societyMemberRepository
                .existsBySocietyIdAndUserId(
                        societyId,
                        residentUserId
                )) {

            throw new IllegalStateException(
                    "User is already a member of this society"
            );
        }

        Unit unit = getSocietyUnit(societyId, unitId);

        if (societyMemberRepository.existsByUnitId(unitId)) {
            throw new IllegalStateException(
                    "This unit is already assigned to a resident"
            );
        }

        SocietyMember member = new SocietyMember();

        member.setSociety(society);
        member.setUser(residentUser);
        member.setUnit(unit);
        member.setRole(SocietyMemberRole.RESIDENT);
        member.setPosition(SocietyPosition.RESIDENT);
        member.setStatus(SocietyMemberStatus.ACTIVE);
        member.setJoinedAt(OffsetDateTime.now());

        return societyMemberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public List<ResidentResponse> getResidents(
            UUID societyId,
            UUID adminUserId
    ) {

        ensureAdmin(societyId, adminUserId);

        return societyMemberRepository
                .findAllBySocietyIdOrderByCreatedAtAsc(societyId)
                .stream()
                .filter(member ->
                        member.getRole() == SocietyMemberRole.RESIDENT
                )
                .map(ResidentResponse::new)
                .toList();
    }

    @Transactional
    public SocietyMember changeUnit(
            UUID societyId,
            UUID adminUserId,
            UUID memberId,
            UUID newUnitId
    ) {

        SocietyMember member =
                getResidentMember(
                        societyId,
                        adminUserId,
                        memberId
                );

        if (member.getStatus() == SocietyMemberStatus.REMOVED) {
            throw new IllegalStateException(
                    "Removed residents cannot be assigned a unit"
            );
        }

        Unit newUnit = getSocietyUnit(
                societyId,
                newUnitId
        );

        societyMemberRepository
                .findBySocietyIdAndUserId(
                        societyId,
                        member.getUser().getId()
                );

        boolean unitUsedByAnotherMember =
                societyMemberRepository.existsByUnitId(newUnitId)
                        && (
                        member.getUnit() == null
                                || !member.getUnit()
                                .getId()
                                .equals(newUnitId)
                );

        if (unitUsedByAnotherMember) {
            throw new IllegalStateException(
                    "This unit is already assigned to another resident"
            );
        }

        member.setUnit(newUnit);

        return societyMemberRepository.save(member);
    }

    @Transactional
    public SocietyMember suspendResident(
            UUID societyId,
            UUID adminUserId,
            UUID memberId
    ) {

        SocietyMember member =
                getResidentMember(
                        societyId,
                        adminUserId,
                        memberId
                );

        if (member.getStatus() == SocietyMemberStatus.REMOVED) {
            throw new IllegalStateException(
                    "Removed residents cannot be suspended"
            );
        }

        if (member.getStatus() == SocietyMemberStatus.SUSPENDED) {
            throw new IllegalStateException(
                    "Resident is already suspended"
            );
        }

        member.setStatus(SocietyMemberStatus.SUSPENDED);

        return societyMemberRepository.save(member);
    }

    @Transactional
    public SocietyMember reactivateResident(
            UUID societyId,
            UUID adminUserId,
            UUID memberId
    ) {

        SocietyMember member =
                getResidentMember(
                        societyId,
                        adminUserId,
                        memberId
                );

        if (member.getStatus() == SocietyMemberStatus.REMOVED) {
            throw new IllegalStateException(
                    "Removed residents cannot be reactivated"
            );
        }

        if (member.getStatus() == SocietyMemberStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Resident is already active"
            );
        }

        member.setStatus(SocietyMemberStatus.ACTIVE);

        return societyMemberRepository.save(member);
    }

    @Transactional
    public SocietyMember removeResident(
            UUID societyId,
            UUID adminUserId,
            UUID memberId
    ) {

        SocietyMember member =
                getResidentMember(
                        societyId,
                        adminUserId,
                        memberId
                );

        if (member.getStatus() == SocietyMemberStatus.REMOVED) {
            throw new IllegalStateException(
                    "Resident is already removed"
            );
        }

        member.setStatus(SocietyMemberStatus.REMOVED);
        member.setUnit(null);

        return societyMemberRepository.save(member);
    }

    private SocietyMember getResidentMember(
            UUID societyId,
            UUID adminUserId,
            UUID memberId
    ) {

        ensureAdmin(societyId, adminUserId);

        SocietyMember member =
                societyMemberRepository.findById(memberId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Resident membership not found"
                                )
                        );

        if (!member.getSociety()
                .getId()
                .equals(societyId)) {

            throw new IllegalArgumentException(
                    "Resident does not belong to this society"
            );
        }

        if (member.getRole() != SocietyMemberRole.RESIDENT) {
            throw new IllegalStateException(
                    "This membership is not a resident membership"
            );
        }

        return member;
    }

    private Unit getSocietyUnit(
            UUID societyId,
            UUID unitId
    ) {

        Unit unit = unitRepository.findById(unitId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Unit not found"
                        )
                );

        if (!unit.getBuilding()
                .getSociety()
                .getId()
                .equals(societyId)) {

            throw new IllegalArgumentException(
                    "Unit does not belong to this society"
            );
        }

        return unit;
    }

    private void ensureAdmin(
            UUID societyId,
            UUID adminUserId
    ) {

        boolean isAdmin =
                societyMemberRepository
                        .existsBySocietyIdAndUserIdAndRole(
                                societyId,
                                adminUserId,
                                SocietyMemberRole.SOCIETY_ADMIN
                        );

        if (!isAdmin) {
            throw new IllegalStateException(
                    "Only society administrators can manage residents"
            );
        }
    }
}