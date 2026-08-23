package com.societyos.society.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DemoPaymentResponse(
        UUID paymentId,
        UUID maintenanceDueId,
        BigDecimal amount,
        String status,
        String transactionReference,
        OffsetDateTime paidAt,
        String message
) {
}