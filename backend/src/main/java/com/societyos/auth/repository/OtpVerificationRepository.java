package com.societyos.auth.repository;

import com.societyos.auth.entity.OtpChannel;
import com.societyos.auth.entity.OtpPurpose;
import com.societyos.auth.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, UUID> {

    Optional<OtpVerification> findTopByUserIdAndChannelAndPurposeOrderByCreatedAtDesc(
            UUID userId,
            OtpChannel channel,
            OtpPurpose purpose
    );

    List<OtpVerification> findByUserIdAndChannelAndPurposeAndVerifiedAtIsNull(
            UUID userId,
            OtpChannel channel,
            OtpPurpose purpose
    );
}