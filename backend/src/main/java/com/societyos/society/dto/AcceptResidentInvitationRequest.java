package com.societyos.society.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AcceptResidentInvitationRequest {

    @NotBlank
    private String token;
}