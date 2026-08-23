package com.societyos.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class VerifyOtpResponse {

    private UUID userId;
    private String message;
    private boolean emailVerified;
    private boolean phoneVerified;
    private boolean accountActive;
}