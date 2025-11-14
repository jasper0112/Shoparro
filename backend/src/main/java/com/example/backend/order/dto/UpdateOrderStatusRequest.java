package com.example.backend.order.dto;

import com.example.backend.order.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 更新订单状态请求DTO
 */
@Data
public class UpdateOrderStatusRequest {

    @NotNull(message = "订单状态不能为空")
    private OrderStatus status;

    private String shippingProvider;

    private String trackingNumber;

    private String notes;
}

