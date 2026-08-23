package com.societyos.auth.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class OtpGenerator {

    private static final int OTP_LENGTH = 6;

    private final SecureRandom secureRandom = new SecureRandom();

    public String generate() {
        int otp = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(otp);
    }
}