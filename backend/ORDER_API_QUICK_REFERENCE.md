# Order Module API 快速参考

## 🔗 基础URL
```
http://localhost:8080/api
```

---

## 📋 API 一览

| 方法 | 端点 | 请求体 | 说明 |
|------|------|--------|------|
| POST | `/orders` | ✅ JSON | 创建订单 |
| GET | `/orders/{id}` | ❌ | 根据ID获取订单 |
| GET | `/orders/number/{orderNumber}` | ❌ | 根据订单号获取订单 |
| GET | `/orders/user/{userId}` | ❌ | 获取用户订单（分页） |
| GET | `/orders/merchant/{merchantId}` | ❌ | 获取商户订单（分页） |
| GET | `/orders` | ❌ | 获取全部订单（分页） |
| GET | `/orders/status/{status}` | ❌ | 根据状态筛选订单 |
| PUT | `/orders/{id}/status` | ✅ JSON | 更新订单状态 |
| PUT | `/orders/{id}/payment-status` | ✅ JSON | 更新支付状态 |
| POST | `/orders/{id}/cancel` | ✅ JSON | 取消订单 |
| DELETE | `/orders/{id}` | ❌ | 删除订单（管理员） |

共 **11** 个 API，其中 **4** 个需要请求体。

---

## 📦 请求体结构

### 1. 创建订单 `POST /orders`
```json
{
  "userId": 1,
  "paymentMethod": "CREDIT_CARD",
  "shippingFee": 10.00,
  "taxAmount": 5.00,
  "discountAmount": 0.00,
  "shippingName": "John Doe",
  "shippingPhone": "0412345678",
  "shippingAddress": "123 Main Street",
  "shippingCity": "Sydney",
  "shippingPostcode": "2000",
  "shippingCountry": "Australia",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 3, "quantity": 1 }
  ]
}
```

### 2. 更新订单状态 `PUT /orders/{id}/status`
```json
{
  "status": "SHIPPED",
  "shippingProvider": "AusPost",
  "trackingNumber": "AU123456789",
  "notes": "Shipped on 2025-01-02"
}
```

### 3. 更新支付状态 `PUT /orders/{id}/payment-status`
```json
{
  "paymentStatus": "PAID",
  "paymentReference": "PAY-123456",
  "paidAt": "2025-01-01T13:10:00"
}
```

### 4. 取消订单 `POST /orders/{id}/cancel`
```json
{
  "userId": 1,
  "reason": "Changed my mind"
}
```

---

## 🎯 状态枚举

- `OrderStatus`: `PENDING_PAYMENT`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED`, `REFUNDED`
- `PaymentStatus`: `PENDING`, `PAID`, `REFUNDED`, `FAILED`, `PARTIALLY_PAID`
- `PaymentMethod`: `CREDIT_CARD`, `DEBIT_CARD`, `PAYPAL`, `WECHAT_PAY`, `ALIPAY`, `BANK_TRANSFER`, `CASH_ON_DELIVERY`

---

## ⚠️ 错误响应格式

```json
{
  "message": "错误信息"
}
```

常见状态码：
- `400`: 请求参数/业务校验失败
- `401`: 未授权（未来接入JWT后）
- `403`: 无权操作（如取消他人订单）
- `404`: 订单不存在
- `500`: 服务器内部错误

---

## 🧪 快速测试

1. `POST /orders`  — 创建订单
2. `PUT /orders/{id}/payment-status` — 标记已支付
3. `PUT /orders/{id}/status` — 发货 / 完成
4. `POST /orders/{id}/cancel` — 取消订单并验证库存恢复

详细说明请查看 `ORDER_API_DOCUMENTATION.md`。*** End Patch

