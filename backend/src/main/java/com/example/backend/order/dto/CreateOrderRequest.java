package com.example.backend.order.dto;

import com.example.backend.order.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * 创建订单请求DTO
 */
@Data
public class CreateOrderRequest {

    @NotNull(message = "用户ID不能为空")
    private Long userId;

    @NotEmpty(message = "订单至少包含一个商品")
    @Valid
    private List<OrderItemRequest> items;

    private PaymentMethod paymentMethod;

    @DecimalMin(value = "0.00", message = "运费不能为负数")
    private BigDecimal shippingFee = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "税费不能为负数")
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @DecimalMin(value = "0.00", message = "折扣不能为负数")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Size(max = 100, message = "收件人姓名不能超过100个字符")
    private String shippingName;

    @Size(max = 30, message = "收件人电话不能超过30个字符")
    private String shippingPhone;

    @Size(max = 500, message = "收货地址不能超过500个字符")
    private String shippingAddress;

    @Size(max = 100, message = "城市名称不能超过100个字符")
    private String shippingCity;

    @Size(max = 20, message = "邮编不能超过20个字符")
    private String shippingPostcode;

    @Size(max = 100, message = "国家名称不能超过100个字符")
    private String shippingCountry;

    @Size(max = 1000, message = "备注不能超过1000个字符")
    private String notes;
}

