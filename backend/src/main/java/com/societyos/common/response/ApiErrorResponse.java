package com.societyos.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.Map;

@Getter
@AllArgsConstructor
public class ApiErrorResponse {

    private boolean success;
    private String message;
    private OffsetDateTime timestamp;
    private Map<String, String> errors;
}