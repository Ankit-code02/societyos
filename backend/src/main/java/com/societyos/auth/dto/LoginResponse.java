package com.societyos.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private UUID userId;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
}