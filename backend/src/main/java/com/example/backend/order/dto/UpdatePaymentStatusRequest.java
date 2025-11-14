package com.example.backend.order.dto;

import com.example.backend.order.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 更新支付状态请求DTO
 */
@Data
public class UpdatePaymentStatusRequest {

    @NotNull(message = "支付状态不能为空")
    private PaymentStatus paymentStatus;

    private String paymentReference;

    private LocalDateTime paidAt;
}

