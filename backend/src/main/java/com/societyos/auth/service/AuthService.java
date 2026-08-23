package com.societyos.auth.service;

import com.societyos.auth.dto.RegisterRequest;
import com.societyos.auth.dto.RegisterResponse;
import com.societyos.auth.entity.Role;
import com.societyos.auth.entity.RoleCode;
import com.societyos.auth.entity.UserRole;
import com.societyos.auth.entity.UserRoleId;
import com.societyos.auth.repository.RefreshTokenRepository;
import com.societyos.auth.repository.RoleRepository;
import com.societyos.auth.repository.UserRoleRepository;
import com.societyos.common.security.JwtService;
import com.societyos.user.entity.User;
import com.societyos.user.entity.UserStatus;
import com.societyos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.societyos.auth.entity.OtpChannel;
import com.societyos.auth.entity.OtpPurpose;
import com.societyos.auth.dto.RefreshTokenResponse;
import com.societyos.auth.entity.RefreshToken;
import com.societyos.auth.dto.LoginRequest;
import com.societyos.auth.dto.LoginResponse;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RegisterResponse register(RegisterRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        String phone = request.getPhone().trim();

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists"
            );
        }

        User user = new User();

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword())
        );
        user.setStatus(UserStatus.PENDING_VERIFICATION);

        User savedUser = userRepository.save(user);

        Role userRole = roleRepository
                .findByCode(RoleCode.USER)
                .orElseThrow(() ->
                        new IllegalStateException("USER role is not configured")
                );

        UserRole userRoleEntity = new UserRole();

        UserRoleId userRoleId = new UserRoleId(
                savedUser.getId(),
                userRole.getId()
        );

        userRoleEntity.setId(userRoleId);
        userRoleEntity.setUser(savedUser);
        userRoleEntity.setRole(userRole);

        userRoleRepository.save(userRoleEntity);

        otpService.generateOtp(
                savedUser,
                OtpChannel.EMAIL,
                OtpPurpose.REGISTRATION
        );

        return new RegisterResponse(
                user.getId(),
                "Registration successful. Verify your email.",
                true
        );
    }
    @Transactional
    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"
                        )
                );

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "Account is not active. Verify your email first."
            );
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        String accessToken = jwtService.generateAccessToken(user);

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        long expiresIn =
                15 * 60;

        return new LoginResponse(
                user.getId(),
                accessToken,
                refreshToken,
                "Bearer",
                expiresIn
        );
    }
    @Transactional
    public RefreshTokenResponse refresh(String rawRefreshToken) {

        RefreshToken oldToken =
                refreshTokenService.findValidRefreshToken(
                        rawRefreshToken
                );

        User user = oldToken.getUser();

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "Account is not active"
            );
        }

        String newAccessToken =
                jwtService.generateAccessToken(user);

        String newRefreshToken =
                refreshTokenService.createRefreshToken(user);

        oldToken.setRevokedAt(
                OffsetDateTime.now()
        );

        refreshTokenRepository.save(oldToken);

        return new RefreshTokenResponse(
                newAccessToken,
                newRefreshToken,
                "Bearer",
                15 * 60
        );
    }
    @Transactional
    public void logout(String rawRefreshToken) {

        refreshTokenService.revoke(rawRefreshToken);
    }
    @Transactional
    public UUID forgotPassword(String email) {

        String normalizedEmail = email
                .trim()
                .toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "No account found with this email"
                        )
                );

        otpService.generatePasswordResetOtp(user);

        return user.getId();
    }
}