package com.societyos.society.dto;

import com.societyos.society.entity.SocietyPosition;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAdminInvitationRequest {

    @NotBlank
    @Email
    private String email;

    @NotNull
    private SocietyPosition position;
}