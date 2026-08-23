package com.societyos.user.controller;

import com.societyos.user.dto.UpdateUserProfileRequest;
import com.societyos.user.dto.UserProfileResponse;
import com.societyos.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public UserProfileResponse getCurrentUser(
            Authentication authentication
    ) {
        User authenticatedUser =
                (User) authentication.getPrincipal();

        return new UserProfileResponse(authenticatedUser);
    }
    @PutMapping("/me")
    public UserProfileResponse updateCurrentUser(
            @Valid @RequestBody UpdateUserProfileRequest request,
            Authentication authentication
    ) {
        User authenticatedUser =
                (User) authentication.getPrincipal();

        authenticatedUser.setFirstName(
                request.getFirstName().trim()
        );

        authenticatedUser.setLastName(
                request.getLastName().trim()
        );

        authenticatedUser.setPhone(
                request.getPhone().trim()
        );

        return new UserProfileResponse(authenticatedUser);
    }
}