package com.example.backend.order.exception;

/**
 * 订单状态异常
 */
public class OrderStatusException extends RuntimeException {

    public OrderStatusException(String message) {
        super(message);
    }

    public OrderStatusException(String message, Throwable cause) {
        super(message, cause);
    }
}

