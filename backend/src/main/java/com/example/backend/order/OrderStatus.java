package com.example.backend.order;

/**
 * 订单状态枚举
 */
public enum OrderStatus {
    PENDING_PAYMENT,   // 待支付
    PROCESSING,        // 已支付，处理中
    SHIPPED,           // 已发货
    DELIVERED,         // 已送达
    COMPLETED,         // 交易完成
    CANCELLED,         // 已取消
    RETURNED,          // 已退货
    REFUNDED           // 已退款
}

