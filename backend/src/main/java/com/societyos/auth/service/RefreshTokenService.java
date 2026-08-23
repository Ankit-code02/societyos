package com.societyos.auth.service;

import com.societyos.auth.entity.RefreshToken;
import com.societyos.auth.repository.RefreshTokenRepository;
import com.societyos.common.security.JwtProperties;
import com.societyos.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private static final int TOKEN_BYTES = 64;
    private final JwtProperties jwtProperties;

    private final RefreshTokenRepository refreshTokenRepository;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public String createRefreshToken(User user) {

        byte[] randomBytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(randomBytes);

        String rawToken = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);

        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(rawToken));
        refreshToken.setExpiresAt(
                OffsetDateTime.now()
                        .plusDays(jwtProperties.getRefreshTokenExpirationDays())
        );

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }
    @Transactional
    public RefreshToken findValidRefreshToken(String rawToken) {

        RefreshToken token = refreshTokenRepository
                .findByTokenHash(hash(rawToken))
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid refresh token"
                        )
                );

        if (token.getRevokedAt() != null) {
            throw new IllegalArgumentException(
                    "Refresh token has been revoked"
            );
        }

        if (token.getExpiresAt().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException(
                    "Refresh token has expired"
            );
        }

        return token;
    }
    @Transactional
    public void revoke(String rawToken) {

        RefreshToken token = refreshTokenRepository
                .findByTokenHash(hash(rawToken))
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid refresh token"
                        )
                );

        token.setRevokedAt(OffsetDateTime.now());

        refreshTokenRepository.save(token);
    }

    private String hash(String token) {

        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getEncoder()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    exception
            );
        }
    }
}