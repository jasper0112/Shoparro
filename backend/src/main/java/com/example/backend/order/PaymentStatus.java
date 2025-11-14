package com.example.backend.order;

/**
 * 支付状态枚举
 */
public enum PaymentStatus {
    PENDING,       // 待支付
    PAID,          // 已支付
    REFUNDED,      // 已退款
    FAILED,        // 支付失败
    PARTIALLY_PAID // 部分支付
}

