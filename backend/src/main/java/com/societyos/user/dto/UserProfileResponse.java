package com.societyos.user.dto;

import com.societyos.user.entity.User;
import lombok.Getter;

import java.time.OffsetDateTime;
import java.util.UUID;

@Getter
public class UserProfileResponse {

    private final UUID id;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String phone;
    private final String status;
    private final OffsetDateTime emailVerifiedAt;
    private final OffsetDateTime phoneVerifiedAt;

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.status = user.getStatus().name();
        this.emailVerifiedAt = user.getEmailVerifiedAt();
        this.phoneVerifiedAt = user.getPhoneVerifiedAt();
    }
}