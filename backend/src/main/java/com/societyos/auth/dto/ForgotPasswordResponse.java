package com.societyos.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class ForgotPasswordResponse {

    private UUID userId;
    private String message;
}