package com.societyos.society.dto;

import jakarta.validation.constraints.Size;

public record CreateAiConversationRequest(

        @Size(max = 200)
        String title
) {
}