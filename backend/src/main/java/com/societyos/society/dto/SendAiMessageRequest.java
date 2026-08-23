package com.societyos.society.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SendAiMessageRequest(

        @NotBlank
        @Size(max = 5000)
        String content
) {
}