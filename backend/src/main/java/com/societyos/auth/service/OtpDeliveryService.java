package com.societyos.auth.service;

import com.societyos.auth.entity.OtpChannel;
import com.societyos.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpDeliveryService {

    private final JavaMailSender mailSender;

    public void sendOtp(
            User user,
            OtpChannel channel,
            String otp
    ) {

        if (channel == OtpChannel.EMAIL) {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(user.getEmail());
            message.setSubject("SocietyOS - Your Verification OTP");

            message.setText(
                    "Hello " + user.getFirstName() + ",\n\n"
                            + "Your SocietyOS verification OTP is: "
                            + otp + "\n\n"
                            + "This OTP is valid for 5 minutes.\n"
                            + "If you did not request this, please ignore this email.\n\n"
                            + "Regards,\n"
                            + "SocietyOS Team"
            );

            mailSender.send(message);

            log.info(
                    "OTP email sent successfully | user={} | email={}",
                    user.getId(),
                    user.getEmail()
            );

        } else if (channel == OtpChannel.PHONE) {

            // SMS delivery will be added next.
            // Keep development logging temporarily for phone OTP.
            log.info(
                    "DEVELOPMENT OTP | PHONE | user={} | phone={} | otp={}",
                    user.getId(),
                    user.getPhone(),
                    otp
            );
        }
    }
}