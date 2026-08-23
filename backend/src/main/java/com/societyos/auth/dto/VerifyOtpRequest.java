package com.societyos.auth.dto;

import com.societyos.auth.entity.OtpChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class VerifyOtpRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "OTP channel is required")
    private OtpChannel channel;

    @NotBlank(message = "OTP is required")
    @Pattern(
            regexp = "^\\d{6}$",
            message = "OTP must contain exactly 6 digits"
    )
    private String otp;
}