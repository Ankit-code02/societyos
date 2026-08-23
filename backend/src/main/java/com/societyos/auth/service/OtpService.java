package com.societyos.auth.service;

import com.societyos.auth.dto.VerifyOtpResponse;
import com.societyos.auth.entity.OtpChannel;
import com.societyos.auth.entity.OtpPurpose;
import com.societyos.auth.entity.OtpVerification;
import com.societyos.auth.repository.OtpVerificationRepository;
import com.societyos.user.entity.User;
import com.societyos.user.entity.UserStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.user.repository.UserRepository;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 5;

    private final OtpGenerator otpGenerator;
    private final OtpVerificationRepository otpVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpDeliveryService otpDeliveryService;
    private final UserRepository userRepository;

    @Transactional
    public String generateOtp(
            User user,
            OtpChannel channel,
            OtpPurpose purpose
    ) {
        invalidatePreviousOtps(user, channel, purpose);

        String otp = otpGenerator.generate();

        OtpVerification verification = new OtpVerification();

        verification.setUser(user);
        verification.setChannel(channel);
        verification.setPurpose(purpose);
        verification.setOtpHash(passwordEncoder.encode(otp));
        verification.setExpiresAt(
                OffsetDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)
        );
        verification.setAttemptCount(0);

        otpVerificationRepository.save(verification);

        otpDeliveryService.sendOtp(
                user,
                channel,
                otp
        );

        return otp;
    }
    @Transactional
    public VerifyOtpResponse verifyOtp(
            UUID userId,
            OtpChannel channel,
            String otp
    ) {
        OtpVerification verification =
                otpVerificationRepository
                        .findTopByUserIdAndChannelAndPurposeOrderByCreatedAtDesc(
                                userId,
                                channel,
                                OtpPurpose.REGISTRATION
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No verification OTP found"
                                )
                        );

        if (verification.getVerifiedAt() != null) {
            throw new IllegalArgumentException(
                    "This OTP has already been used"
            );
        }

        if (verification.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }

        if (verification.getAttemptCount() >= 5) {
            throw new IllegalArgumentException(
                    "Maximum OTP attempts exceeded"
            );
        }

        if (!passwordEncoder.matches(
                otp,
                verification.getOtpHash()
        )) {
            verification.setAttemptCount(
                    verification.getAttemptCount() + 1
            );

            otpVerificationRepository.save(verification);

            throw new IllegalArgumentException(
                    "Invalid OTP"
            );
        }


        verification.setVerifiedAt(OffsetDateTime.now());

        otpVerificationRepository.save(verification);

        User user = verification.getUser();

        if (channel == OtpChannel.EMAIL) {
            user.setEmailVerifiedAt(OffsetDateTime.now());
            user.setStatus(UserStatus.ACTIVE);
        }

        return new VerifyOtpResponse(
                user.getId(),
                getVerificationMessage(user),
                user.getEmailVerifiedAt() != null,
                user.getPhoneVerifiedAt() != null,
                user.getStatus() == UserStatus.ACTIVE
        );
    }
    @Transactional
    public void resendRegistrationOtp(UUID userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        if (user.getEmailVerifiedAt() != null) {
            throw new IllegalArgumentException(
                    "Email is already verified"
            );
        }

        generateOtp(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION
        );
    }
    @Transactional
    public UUID generatePasswordResetOtp(User user) {

        invalidatePreviousOtps(
                user,
                OtpChannel.EMAIL,
                OtpPurpose.PASSWORD_RESET
        );

        String otp = otpGenerator.generate();

        OtpVerification verification = new OtpVerification();

        verification.setUser(user);
        verification.setChannel(OtpChannel.EMAIL);
        verification.setPurpose(OtpPurpose.PASSWORD_RESET);
        verification.setOtpHash(passwordEncoder.encode(otp));
        verification.setExpiresAt(
                OffsetDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)
        );
        verification.setAttemptCount(0);

        otpVerificationRepository.save(verification);

        otpDeliveryService.sendOtp(
                user,
                OtpChannel.EMAIL,
                otp
        );

        return user.getId();
    }
    @Transactional
    public void resetPassword(
            UUID userId,
            String otp,
            String newPassword,
            String confirmPassword
    ) {

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException(
                    "Passwords do not match"
            );
        }

        OtpVerification verification =
                otpVerificationRepository
                        .findTopByUserIdAndChannelAndPurposeOrderByCreatedAtDesc(
                                userId,
                                OtpChannel.EMAIL,
                                OtpPurpose.PASSWORD_RESET
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "No password reset OTP found"
                                )
                        );

        if (verification.getVerifiedAt() != null) {
            throw new IllegalArgumentException(
                    "This OTP has already been used"
            );
        }

        if (verification.getExpiresAt()
                .isBefore(OffsetDateTime.now())) {

            throw new IllegalArgumentException(
                    "OTP has expired"
            );
        }

        if (verification.getAttemptCount() >= 5) {
            throw new IllegalArgumentException(
                    "Maximum OTP attempts exceeded"
            );
        }

        if (!passwordEncoder.matches(
                otp,
                verification.getOtpHash()
        )) {

            verification.setAttemptCount(
                    verification.getAttemptCount() + 1
            );

            otpVerificationRepository.save(verification);

            throw new IllegalArgumentException(
                    "Invalid OTP"
            );
        }

        verification.setVerifiedAt(
                OffsetDateTime.now()
        );

        otpVerificationRepository.save(verification);

        User user = verification.getUser();

        user.setPasswordHash(
                passwordEncoder.encode(newPassword)
        );
    }

    private String getVerificationMessage(User user) {

        if (user.getStatus() == UserStatus.ACTIVE) {
            return "Email verified. Account is now active.";
        }

        return "Email verification is required.";
    }

    private void invalidatePreviousOtps(
            User user,
            OtpChannel channel,
            OtpPurpose purpose
    ) {
        otpVerificationRepository
                .findByUserIdAndChannelAndPurposeAndVerifiedAtIsNull(
                        user.getId(),
                        channel,
                        purpose
                )
                .forEach(otp -> {
                    otp.setVerifiedAt(OffsetDateTime.now());
                });
    }
}