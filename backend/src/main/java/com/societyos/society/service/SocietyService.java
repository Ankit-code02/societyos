package com.societyos.society.service;

import com.societyos.society.dto.CreateSocietyRequest;
import com.societyos.society.dto.CreateSocietyResponse;
import com.societyos.society.dto.MySocietyResponse;
import com.societyos.society.entity.*;
import com.societyos.society.repository.SocietyMemberRepository;
import com.societyos.society.repository.SocietyRepository;
import com.societyos.society.repository.SocietyVerificationRepository;
import com.societyos.user.entity.User;
import com.societyos.user.entity.UserStatus;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SocietyService {

    private final SocietyRepository societyRepository;
    private final SocietyVerificationRepository societyVerificationRepository;
    private final SocietyMemberRepository societyMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public CreateSocietyResponse createSociety(
            UUID authenticatedUserId,
            CreateSocietyRequest request
    ) {

        User applicant = userRepository.findById(authenticatedUserId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        )
                );

        if (applicant.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalStateException(
                    "Only active users can create a society"
            );
        }

        boolean duplicateExists = societyRepository
                .findAll()
                .stream()
                .anyMatch(existing ->
                        existing.getName()
                                .trim()
                                .equalsIgnoreCase(
                                        request.getName().trim()
                                )
                                &&
                                existing.getCity()
                                        .trim()
                                        .equalsIgnoreCase(
                                                request.getCity().trim()
                                        )
                                &&
                                existing.getState()
                                        .trim()
                                        .equalsIgnoreCase(
                                                request.getState().trim()
                                        )
                                &&
                                existing.getPinCode()
                                        .trim()
                                        .equals(
                                                request.getPinCode().trim()
                                        )
                );

        if (duplicateExists) {
            throw new IllegalStateException(
                    "A society with the same name and location already exists"
            );
        }

        Society society = new Society();

        society.setName(request.getName().trim());
        society.setAddressLine(request.getAddressLine().trim());
        society.setCity(request.getCity().trim());
        society.setState(request.getState().trim());
        society.setPinCode(request.getPinCode().trim());
        society.setBuildingCount(request.getBuildingCount());
        society.setUnitCount(request.getUnitCount());
        society.setStatus(SocietyStatus.PENDING_VERIFICATION);

        Society savedSociety = societyRepository.save(society);

        SocietyVerification verification =
                new SocietyVerification();

        verification.setSociety(savedSociety);
        verification.setApplicant(applicant);
        verification.setClaimedPosition(
                request.getClaimedPosition()
        );
        verification.setStatus(
                SocietyVerificationStatus.PENDING
        );

        SocietyVerification savedVerification =
                societyVerificationRepository.save(
                        verification
                );

        return new CreateSocietyResponse(
                savedSociety.getId(),
                savedVerification.getId(),
                savedSociety.getStatus(),
                savedVerification.getStatus(),
                "Society registration submitted successfully."
        );
    }
    @Transactional(readOnly = true)
    public List<MySocietyResponse> getMySocieties(
            UUID authenticatedUserId
    ) {

        List<SocietyMember> memberships =
                societyMemberRepository
                        .findAllByUserIdAndStatusOrderByCreatedAtAsc(
                                authenticatedUserId,
                                SocietyMemberStatus.ACTIVE
                        );

        return memberships.stream()
                .map(member -> new MySocietyResponse(
                        member.getSociety().getId(),
                        member.getSociety().getName(),
                        member.getSociety().getStatus(),
                        member.getRole(),
                        member.getPosition(),
                        member.getStatus()
                ))
                .toList();
    }
}