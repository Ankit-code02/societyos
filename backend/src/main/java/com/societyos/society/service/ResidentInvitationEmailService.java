package com.societyos.society.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResidentInvitationEmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public void sendInvitation(
            String email,
            String firstName,
            String societyName,
            String buildingName,
            String unitNumber,
            String token
    ) {

        String invitationUrl =
                frontendUrl + "/invite/resident?token=" + token;

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "SocietyOS - You're invited to join "
                        + societyName
        );

        message.setText(
                "Hello"
                        + (firstName != null && !firstName.isBlank()
                        ? " " + firstName
                        : "")
                        + ",\n\n"

                        + "You have been invited to join "
                        + societyName
                        + " on SocietyOS.\n\n"

                        + "Society: "
                        + societyName
                        + "\n"

                        + "Building: "
                        + buildingName
                        + "\n"

                        + "Unit: "
                        + unitNumber
                        + "\n\n"

                        + "Click the link below to accept your invitation "
                        + "and create your SocietyOS account:\n\n"

                        + invitationUrl
                        + "\n\n"

                        + "This invitation is valid for 48 hours.\n\n"

                        + "If you were not expecting this invitation, "
                        + "you can safely ignore this email.\n\n"

                        + "Regards,\n"
                        + "SocietyOS Team"
        );

        mailSender.send(message);

        log.info(
                "Resident invitation email sent | email={} | society={}",
                email,
                societyName
        );
    }
}