package com.societyos.auth.controller;

import com.societyos.auth.dto.*;
import com.societyos.auth.service.AuthContextService;
import com.societyos.auth.service.AuthService;
import com.societyos.auth.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.societyos.auth.dto.RefreshTokenRequest;
import com.societyos.auth.dto.RefreshTokenResponse;
import org.springframework.security.core.Authentication;
import com.societyos.user.entity.User;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final AuthContextService authContextService;
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        RegisterResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
    @PostMapping("/verification/verify")
    public ResponseEntity<VerifyOtpResponse> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        VerifyOtpResponse response = otpService.verifyOtp(
                request.getUserId(),
                request.getChannel(),
                request.getOtp()
        );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/verification/resend")
    public ResponseEntity<Void> resendVerificationOtp(
            @RequestParam UUID userId
    ) {
        otpService.resendRegistrationOtp(userId);

        return ResponseEntity.noContent().build();
    }
    @PostMapping("/refresh")
    public ResponseEntity<RefreshTokenResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        RefreshTokenResponse response =
                authService.refresh(request.getRefreshToken());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/me")
    public ResponseEntity<AuthContextResponse> me(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        UUID userId = user.getId();

        return ResponseEntity.ok(
                authContextService.getContext(userId)
        );
    }
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Valid @RequestBody RefreshTokenRequest request
    ) {
        authService.logout(request.getRefreshToken());

        return ResponseEntity.noContent().build();
    }
    @PostMapping("/password/forgot")
    public ResponseEntity<ForgotPasswordResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        UUID userId = authService.forgotPassword(
                request.getEmail()
        );

        return ResponseEntity.ok(
                new ForgotPasswordResponse(
                        userId,
                        "Password reset OTP sent."
                )
        );
    }
    @PostMapping("/password/reset")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        otpService.resetPassword(
                request.getUserId(),
                request.getOtp(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );

        return ResponseEntity.noContent().build();
    }
}