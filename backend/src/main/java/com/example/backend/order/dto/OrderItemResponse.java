package com.example.backend.order.dto;

import com.example.backend.order.OrderItem;
import com.example.backend.order.OrderItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 订单项响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String productSku;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private Long merchantId;
    private String merchantName;
    private OrderItemStatus status;
    private String notes;

    public static OrderItemResponse fromEntity(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .productSku(item.getProductSku())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .totalPrice(item.getTotalPrice())
                .merchantId(item.getMerchant() != null ? item.getMerchant().getId() : null)
                .merchantName(item.getMerchant() != null ? (item.getMerchant().getBusinessName() != null
                        ? item.getMerchant().getBusinessName()
                        : item.getMerchant().getUsername()) : null)
                .status(item.getStatus())
                .notes(item.getNotes())
                .build();
    }
}

