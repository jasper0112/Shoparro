package com.example.backend.product.exception;

/**
 * 未授权访问商品异常
 * 用于商户只能操作自己的商品
 */
public class UnauthorizedProductAccessException extends RuntimeException {
    
    public UnauthorizedProductAccessException(String message) {
        super(message);
    }
    
    public UnauthorizedProductAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}

