# Order Module API 文档 - Postman 测试指南

## 📌 基础信息

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

## ✅ 订单 API 列表

| # | 方法 | 端点 | 描述 |
|---|------|------|------|
| 1 | POST | `/orders` | 创建订单 |
| 2 | GET | `/orders/{id}` | 根据ID获取订单 |
| 3 | GET | `/orders/number/{orderNumber}` | 根据订单号获取订单 |
| 4 | GET | `/orders/user/{userId}` | 获取用户订单（分页） |
| 5 | GET | `/orders/merchant/{merchantId}` | 获取商户订单（分页） |
| 6 | GET | `/orders` | 获取全部订单（分页） |
| 7 | GET | `/orders/status/{status}` | 根据状态获取订单 |
| 8 | PUT | `/orders/{id}/status` | 更新订单状态 |
| 9 | PUT | `/orders/{id}/payment-status` | 更新支付状态 |
|10 | POST | `/orders/{id}/cancel` | 取消订单 |
|11 | DELETE | `/orders/{id}` | 删除订单（管理员） |

---

## 📦 请求体结构

### 1. 创建订单 `POST /orders`

```json
{
  "userId": 1,
  "paymentMethod": "CREDIT_CARD",
  "shippingFee": 10.00,
  "taxAmount": 5.00,
  "discountAmount": 20.00,
  "shippingName": "John Doe",
  "shippingPhone": "0412345678",
  "shippingAddress": "123 Main Street",
  "shippingCity": "Sydney",
  "shippingPostcode": "2000",
  "shippingCountry": "Australia",
  "notes": "Leave at front door",
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "notes": "Gift wrap"
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

**成功响应（201 Created）**
```json
{
  "id": 10,
  "orderNumber": "ORD-20250101125630-AB12CD",
  "customerId": 1,
  "customerName": "customer001",
  "status": "PENDING_PAYMENT",
  "paymentStatus": "PENDING",
  "paymentMethod": "CREDIT_CARD",
  "subtotal": 2598.00,
  "shippingFee": 10.00,
  "taxAmount": 5.00,
  "discountAmount": 20.00,
  "totalAmount": 2593.00,
  "shippingName": "John Doe",
  "shippingPhone": "0412345678",
  "items": [
    {
      "productId": 1,
      "productName": "iPhone 15 Pro",
      "quantity": 2,
      "unitPrice": 1299.00,
      "totalPrice": 2598.00,
      "merchantId": 2,
      "merchantName": "Jane's Electronics Store",
      "status": "PENDING"
    }
  ],
  "orderDate": "2025-01-01T12:56:30",
  "updatedAt": "2025-01-01T12:56:30"
}
```

**错误响应示例**
```json
{
  "message": "商品库存不足: iPhone 15 Pro"
}
```

---

### 2. 获取订单 `GET /orders/{id}`

**响应（200 OK）** —— 同 `OrderResponse` 结构

---

### 3. 获取用户订单 `GET /orders/user/{userId}`

**查询参数**
- `page` (默认 0)
- `size` (默认 20)
- `sortBy` (默认 `orderDate`)
- `sortDir` (`ASC` / `DESC`，默认 `DESC`)

**响应（200 OK）**
```json
{
  "content": [
    {
      "id": 10,
      "orderNumber": "ORD-20250101125630-AB12CD",
      "totalAmount": 2593.00,
      "status": "PENDING_PAYMENT",
      "orderDate": "2025-01-01T12:56:30"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 1,
  "totalPages": 1
}
```

---

### 4. 更新订单状态 `PUT /orders/{id}/status`

```json
{
  "status": "SHIPPED",
  "shippingProvider": "AusPost",
  "trackingNumber": "AU123456789",
  "notes": "Shipped on 2025-01-02"
}
```

**响应（200 OK）** —— 更新后的 `OrderResponse`

---

### 5. 更新支付状态 `PUT /orders/{id}/payment-status`

```json
{
  "paymentStatus": "PAID",
  "paymentReference": "PAY-123456",
  "paidAt": "2025-01-01T13:10:00"
}
```

**响应（200 OK）** —— 更新后的 `OrderResponse`

---

### 6. 取消订单 `POST /orders/{id}/cancel`

```json
{
  "userId": 1,
  "reason": "Changed my mind"
}
```

**响应（200 OK）**
```json
{
  "id": 10,
  "status": "CANCELLED",
  "paymentStatus": "FAILED",
  "cancellationReason": "Changed my mind",
  "cancelledDate": "2025-01-01T13:00:00",
  ...
}
```

---

## ⚙️ 支持的状态值

- **OrderStatus**: `PENDING_PAYMENT`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED`, `REFUNDED`
- **PaymentStatus**: `PENDING`, `PAID`, `REFUNDED`, `FAILED`, `PARTIALLY_PAID`
- **PaymentMethod**: `CREDIT_CARD`, `DEBIT_CARD`, `PAYPAL`, `WECHAT_PAY`, `ALIPAY`, `BANK_TRANSFER`, `CASH_ON_DELIVERY`

---

## 🧪 Postman 测试建议

1. **创建订单**
   ```bash
   POST http://localhost:8080/api/orders
   ```
2. **获取用户订单**
   ```bash
   GET http://localhost:8080/api/orders/user/1?page=0&size=10
   ```
3. **更新支付状态**
   ```bash
   PUT http://localhost:8080/api/orders/10/payment-status
   ```
4. **更新发货状态**
   ```bash
   PUT http://localhost:8080/api/orders/10/status
   ```
5. **取消订单**
   ```bash
   POST http://localhost:8080/api/orders/10/cancel
   ```

---

## ⚠️ 注意事项

1. 创建订单会实时扣减商品库存，取消订单将恢复库存。
2. 当前未集成真实认证，`userId` / `merchantId` 通过请求参数或 Body 传入。
3. `orderNumber` 由系统自动生成，格式：`ORD-yyyyMMddHHmmss-XXXXXX`。
4. 建议在生产环境中集成 JWT 鉴权、支付网关和日志审计。

---

**文档版本**: 1.0  
**最后更新**: 2025-01-XX

