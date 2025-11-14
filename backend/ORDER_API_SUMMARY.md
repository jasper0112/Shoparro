# Order Module API 总结 - Postman 测试指南

## 📌 基础信息

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

## 📋 API 列表总览

订单模块共有 **12 个 API**，其中 **4 个需要请求体**，**8 个不需要请求体**。

### 需要请求体的 API（4个）

| # | 方法 | 端点 | 说明 |
|---|------|------|------|
| 1 | POST | `/orders` | 创建订单 |
| 2 | PUT | `/orders/{id}/status` | 更新订单状态 |
| 3 | PUT | `/orders/{id}/payment-status` | 更新支付状态 |
| 4 | POST | `/orders/{id}/cancel` | 取消订单 |

### 不需要请求体的 API（8个）

| # | 方法 | 端点 | 说明 |
|---|------|------|------|
| 5 | GET | `/orders/{id}` | 根据ID获取订单 |
| 6 | GET | `/orders/number/{orderNumber}` | 根据订单号获取订单 |
| 7 | GET | `/orders/user/{userId}` | 获取用户订单（分页） |
| 8 | GET | `/orders/merchant/{merchantId}` | 获取商户订单（分页） |
| 9 | GET | `/orders` | 获取全部订单（分页） |
| 10 | GET | `/orders/status/{status}` | 根据状态获取订单（分页） |
| 11 | DELETE | `/orders/{id}` | 删除订单（管理员） |

---

## 📦 需要请求体的 API 详细结构

### 1. 创建订单
**Endpoint**: `POST /api/orders`

**请求体结构**:
```json
{
  "userId": 1,                                    // Long, 必填 - 用户ID
  "items": [                                      // List<OrderItemRequest>, 必填 - 订单商品列表
    {
      "productId": 1,                            // Long, 必填 - 商品ID
      "quantity": 2,                              // Integer, 必填, >=1 - 购买数量
      "notes": "请小心轻放"                        // String, 可选 - 商品备注
    },
    {
      "productId": 2,
      "quantity": 1,
      "notes": "需要礼品包装"
    }
  ],
  "paymentMethod": "CREDIT_CARD",                // PaymentMethod枚举, 可选 - 支付方式
  "shippingFee": 10.00,                          // BigDecimal, 可选, >=0 - 运费（默认0）
  "taxAmount": 5.00,                             // BigDecimal, 可选, >=0 - 税费（默认0）
  "discountAmount": 20.00,                       // BigDecimal, 可选, >=0 - 折扣金额（默认0）
  "shippingName": "John Doe",                    // String, 可选, <=100 - 收件人姓名
  "shippingPhone": "0412345678",                 // String, 可选, <=30 - 收件人电话
  "shippingAddress": "123 Main Street",          // String, 可选, <=500 - 收货地址
  "shippingCity": "Sydney",                      // String, 可选, <=100 - 城市
  "shippingPostcode": "2000",                    // String, 可选, <=20 - 邮编
  "shippingCountry": "Australia",                // String, 可选, <=100 - 国家
  "notes": "请在工作日配送"                        // String, 可选, <=1000 - 备注
}
```

**字段说明**:
- `userId`: 必填，下单用户ID
- `items`: 必填，至少包含一个商品，每个商品包含：
  - `productId`: 必填，商品ID（系统会从商品实体获取当前价格作为价格快照）
  - `quantity`: 必填，购买数量，必须>=1
  - `notes`: 可选，该商品的备注信息
- `paymentMethod`: 可选，支付方式枚举值（CREDIT_CARD, DEBIT_CARD, PAYPAL, BANK_TRANSFER, CASH_ON_DELIVERY, OTHER）
- `shippingFee`, `taxAmount`, `discountAmount`: 可选，金额类型，默认0，必须>=0
- 收货地址相关字段：全部可选
- `notes`: 可选，订单备注

---

### 2. 更新订单状态
**Endpoint**: `PUT /api/orders/{id}/status`

**请求体结构**:
```json
{
  "status": "SHIPPED",                           // OrderStatus枚举, 必填 - 订单状态
  "shippingProvider": "Australia Post",         // String, 可选 - 物流公司
  "trackingNumber": "AU123456789",              // String, 可选 - 物流单号
  "notes": "已发货，预计3-5个工作日送达"          // String, 可选 - 备注
}
```

**字段说明**:
- `status`: 必填，订单状态枚举值
  - `PENDING` - 待处理
  - `CONFIRMED` - 已确认
  - `PROCESSING` - 处理中
  - `SHIPPED` - 已发货
  - `DELIVERED` - 已送达
  - `CANCELLED` - 已取消
  - `REFUNDED` - 已退款
- `shippingProvider`: 可选，物流公司名称
- `trackingNumber`: 可选，物流跟踪单号
- `notes`: 可选，状态更新备注

---

### 3. 更新支付状态
**Endpoint**: `PUT /api/orders/{id}/payment-status`

**请求体结构**:
```json
{
  "paymentStatus": "PAID",                       // PaymentStatus枚举, 必填 - 支付状态
  "paymentReference": "TXN123456789",          // String, 可选 - 支付参考号/交易号
  "paidAt": "2025-01-15T10:30:00"              // LocalDateTime, 可选 - 支付时间（ISO格式）
}
```

**字段说明**:
- `paymentStatus`: 必填，支付状态枚举值
  - `PENDING` - 待支付
  - `PAID` - 已支付
  - `FAILED` - 支付失败
  - `REFUNDED` - 已退款
  - `PARTIALLY_REFUNDED` - 部分退款
- `paymentReference`: 可选，支付参考号或交易号
- `paidAt`: 可选，支付时间，ISO 8601格式（如：2025-01-15T10:30:00）

---

### 4. 取消订单
**Endpoint**: `POST /api/orders/{id}/cancel`

**请求体结构**:
```json
{
  "userId": 1,                                   // Long, 必填 - 用户ID（用于验证权限）
  "reason": "不想要了"                            // String, 必填 - 取消原因
}
```

**字段说明**:
- `userId`: 必填，用户ID（用于验证是否为订单所有者）
- `reason`: 必填，取消原因说明

---

## 📋 不需要请求体的 API 参数说明

### 5. 根据ID获取订单
**Endpoint**: `GET /api/orders/{id}`

**Path Parameters**:
- `id` (Long) - 订单ID

**Example**: `GET /api/orders/1`

---

### 6. 根据订单号获取订单
**Endpoint**: `GET /api/orders/number/{orderNumber}`

**Path Parameters**:
- `orderNumber` (String) - 订单号（UUID格式）

**Example**: `GET /api/orders/number/550e8400-e29b-41d4-a716-446655440000`

---

### 7. 获取用户订单（分页）
**Endpoint**: `GET /api/orders/user/{userId}`

**Path Parameters**:
- `userId` (Long) - 用户ID

**Query Parameters**:
- `page` (int, default: 0) - 页码（从0开始）
- `size` (int, default: 20) - 每页数量
- `sortBy` (String, default: "orderDate") - 排序字段
- `sortDir` (String, default: "DESC") - 排序方向（ASC/DESC）

**Example**: `GET /api/orders/user/1?page=0&size=20&sortBy=orderDate&sortDir=DESC`

---

### 8. 获取商户订单（分页）
**Endpoint**: `GET /api/orders/merchant/{merchantId}`

**Path Parameters**:
- `merchantId` (Long) - 商户ID

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 20)
- `sortBy` (String, default: "orderDate")
- `sortDir` (String, default: "DESC")

**Example**: `GET /api/orders/merchant/1?page=0&size=20`

---

### 9. 获取全部订单（分页）
**Endpoint**: `GET /api/orders`

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 20)
- `sortBy` (String, default: "orderDate")
- `sortDir` (String, default: "DESC")

**Example**: `GET /api/orders?page=0&size=20&sortBy=orderDate&sortDir=DESC`

---

### 10. 根据状态获取订单（分页）
**Endpoint**: `GET /api/orders/status/{status}`

**Path Parameters**:
- `status` (OrderStatus枚举) - 订单状态
  - `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 20)

**Example**: `GET /api/orders/status/PENDING?page=0&size=20`

---

### 11. 删除订单（管理员）
**Endpoint**: `DELETE /api/orders/{id}`

**Path Parameters**:
- `id` (Long) - 订单ID

**Example**: `DELETE /api/orders/1`

**注意**: 此接口通常需要管理员权限

---

## 🎯 枚举值说明

### OrderStatus（订单状态）
- `PENDING` - 待处理
- `CONFIRMED` - 已确认
- `PROCESSING` - 处理中
- `SHIPPED` - 已发货
- `DELIVERED` - 已送达
- `CANCELLED` - 已取消
- `REFUNDED` - 已退款

### PaymentStatus（支付状态）
- `PENDING` - 待支付
- `PAID` - 已支付
- `FAILED` - 支付失败
- `REFUNDED` - 已退款
- `PARTIALLY_REFUNDED` - 部分退款

### PaymentMethod（支付方式）
- `CREDIT_CARD` - 信用卡
- `DEBIT_CARD` - 借记卡
- `PAYPAL` - PayPal
- `BANK_TRANSFER` - 银行转账
- `CASH_ON_DELIVERY` - 货到付款
- `OTHER` - 其他

---

## 📝 快速测试示例

### 测试1: 创建订单
```bash
POST http://localhost:8080/api/orders
{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "notes": "请小心轻放"
    }
  ],
  "paymentMethod": "CREDIT_CARD",
  "shippingFee": 10.00,
  "shippingName": "John Doe",
  "shippingAddress": "123 Main Street",
  "shippingCity": "Sydney",
  "shippingPostcode": "2000",
  "shippingCountry": "Australia"
}
```

### 测试2: 更新订单状态
```bash
PUT http://localhost:8080/api/orders/1/status
{
  "status": "SHIPPED",
  "shippingProvider": "Australia Post",
  "trackingNumber": "AU123456789"
}
```

### 测试3: 更新支付状态
```bash
PUT http://localhost:8080/api/orders/1/payment-status
{
  "paymentStatus": "PAID",
  "paymentReference": "TXN123456789",
  "paidAt": "2025-01-15T10:30:00"
}
```

### 测试4: 取消订单
```bash
POST http://localhost:8080/api/orders/1/cancel
{
  "userId": 1,
  "reason": "不想要了"
}
```

---

## ⚠️ 注意事项

1. **创建订单时**:
   - 系统会自动检查商品库存
   - 库存不足会抛出异常
   - 订单创建成功后会自动减少商品库存
   - 订单总金额 = 商品总价 + 运费 + 税费 - 折扣

2. **取消订单时**:
   - 只有订单所有者可以取消
   - 取消后会自动恢复商品库存
   - 如果已支付，需要处理退款

3. **订单号**:
   - 系统自动生成唯一订单号（UUID格式）
   - 订单号格式：`550e8400-e29b-41d4-a716-446655440000`

4. **分页参数**:
   - 所有分页接口都支持 `page` 和 `size` 参数
   - `page` 从 0 开始
   - 默认每页 20 条记录

---

**文档版本**: 1.0  
**最后更新**: 2025-01-XX

