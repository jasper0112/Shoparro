# Order Module API - 请求体数据结构

## 📋 总览

订单模块共有 **12 个 API**，其中 **4 个需要请求体**，**8 个不需要请求体**。

---

## ✅ 需要请求体的 API（4个）

### 1. 创建订单
**Endpoint**: `POST /api/orders`

**请求体结构**:
```json
{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "notes": "请小心轻放"
    },
    {
      "productId": 2,
      "quantity": 1,
      "notes": "需要礼品包装"
    }
  ],
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
  "notes": "请在工作日配送"
}
```

**字段详细说明**:

| 字段 | 类型 | 必填 | 说明 | 验证规则 |
|------|------|------|------|----------|
| userId | Long | ✅ | 用户ID | 不能为空 |
| items | List<OrderItemRequest> | ✅ | 订单商品列表 | 至少包含一个商品 |
| items[].productId | Long | ✅ | 商品ID | 不能为空（系统会从商品获取价格） |
| items[].quantity | Integer | ✅ | 购买数量 | >=1 |
| items[].notes | String | ❌ | 商品备注 | - |
| paymentMethod | PaymentMethod | ❌ | 支付方式 | CREDIT_CARD, DEBIT_CARD, PAYPAL, BANK_TRANSFER, CASH_ON_DELIVERY, OTHER |
| shippingFee | BigDecimal | ❌ | 运费 | >=0，默认0 |
| taxAmount | BigDecimal | ❌ | 税费 | >=0，默认0 |
| discountAmount | BigDecimal | ❌ | 折扣金额 | >=0，默认0 |
| shippingName | String | ❌ | 收件人姓名 | <=100字符 |
| shippingPhone | String | ❌ | 收件人电话 | <=30字符 |
| shippingAddress | String | ❌ | 收货地址 | <=500字符 |
| shippingCity | String | ❌ | 城市 | <=100字符 |
| shippingPostcode | String | ❌ | 邮编 | <=20字符 |
| shippingCountry | String | ❌ | 国家 | <=100字符 |
| notes | String | ❌ | 订单备注 | <=1000字符 |

**注意**: 
- 商品价格会从商品实体中自动获取，作为价格快照保存
- 系统会自动检查商品库存，库存不足会抛出异常
- 订单创建成功后会自动减少商品库存

---

### 2. 更新订单状态
**Endpoint**: `PUT /api/orders/{id}/status`

**请求体结构**:
```json
{
  "status": "SHIPPED",
  "shippingProvider": "Australia Post",
  "trackingNumber": "AU123456789",
  "notes": "已发货，预计3-5个工作日送达"
}
```

**字段详细说明**:

| 字段 | 类型 | 必填 | 说明 | 验证规则 |
|------|------|------|------|----------|
| status | OrderStatus | ✅ | 订单状态 | 不能为空 |
| shippingProvider | String | ❌ | 物流公司 | - |
| trackingNumber | String | ❌ | 物流单号 | - |
| notes | String | ❌ | 备注 | - |

**OrderStatus 枚举值**:
- `PENDING` - 待处理
- `CONFIRMED` - 已确认
- `PROCESSING` - 处理中
- `SHIPPED` - 已发货
- `DELIVERED` - 已送达
- `CANCELLED` - 已取消
- `REFUNDED` - 已退款

---

### 3. 更新支付状态
**Endpoint**: `PUT /api/orders/{id}/payment-status`

**请求体结构**:
```json
{
  "paymentStatus": "PAID",
  "paymentReference": "TXN123456789",
  "paidAt": "2025-01-15T10:30:00"
}
```

**字段详细说明**:

| 字段 | 类型 | 必填 | 说明 | 验证规则 |
|------|------|------|------|----------|
| paymentStatus | PaymentStatus | ✅ | 支付状态 | 不能为空 |
| paymentReference | String | ❌ | 支付参考号/交易号 | - |
| paidAt | LocalDateTime | ❌ | 支付时间 | ISO 8601格式，如：2025-01-15T10:30:00 |

**PaymentStatus 枚举值**:
- `PENDING` - 待支付
- `PAID` - 已支付
- `FAILED` - 支付失败
- `REFUNDED` - 已退款
- `PARTIALLY_REFUNDED` - 部分退款

---

### 4. 取消订单
**Endpoint**: `POST /api/orders/{id}/cancel`

**请求体结构**:
```json
{
  "userId": 1,
  "reason": "不想要了"
}
```

**字段详细说明**:

| 字段 | 类型 | 必填 | 说明 | 验证规则 |
|------|------|------|------|----------|
| userId | Long | ✅ | 用户ID | 不能为空（用于验证权限） |
| reason | String | ✅ | 取消原因 | 不能为空 |

**注意**: 
- 只有订单所有者可以取消订单
- 取消订单后会自动恢复商品库存
- 如果订单已支付，需要处理退款流程

---

## ❌ 不需要请求体的 API（8个）

这些API只需要URL参数，不需要请求体：

1. **GET** `/api/orders/{id}` - 根据ID获取订单
2. **GET** `/api/orders/number/{orderNumber}` - 根据订单号获取订单
3. **GET** `/api/orders/user/{userId}` - 获取用户订单（分页）
4. **GET** `/api/orders/merchant/{merchantId}` - 获取商户订单（分页）
5. **GET** `/api/orders` - 获取全部订单（分页）
6. **GET** `/api/orders/status/{status}` - 根据状态获取订单（分页）
7. **DELETE** `/api/orders/{id}` - 删除订单（管理员）

---

## 📝 Postman 测试示例

### 示例1: 创建订单（完整数据）
```json
POST http://localhost:8080/api/orders
Content-Type: application/json

{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "notes": "请小心轻放"
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "paymentMethod": "CREDIT_CARD",
  "shippingFee": 10.00,
  "taxAmount": 5.00,
  "discountAmount": 20.00,
  "shippingName": "John Doe",
  "shippingPhone": "0412345678",
  "shippingAddress": "123 Main Street, Apartment 4B",
  "shippingCity": "Sydney",
  "shippingPostcode": "2000",
  "shippingCountry": "Australia",
  "notes": "请在工作日配送，谢谢"
}
```

### 示例2: 创建订单（最小数据）
```json
POST http://localhost:8080/api/orders
Content-Type: application/json

{
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 1
    }
  ]
}
```

### 示例3: 更新订单状态
```json
PUT http://localhost:8080/api/orders/1/status
Content-Type: application/json

{
  "status": "SHIPPED",
  "shippingProvider": "Australia Post",
  "trackingNumber": "AU123456789",
  "notes": "已发货，预计3-5个工作日送达"
}
```

### 示例4: 更新支付状态
```json
PUT http://localhost:8080/api/orders/1/payment-status
Content-Type: application/json

{
  "paymentStatus": "PAID",
  "paymentReference": "TXN123456789",
  "paidAt": "2025-01-15T10:30:00"
}
```

### 示例5: 取消订单
```json
POST http://localhost:8080/api/orders/1/cancel
Content-Type: application/json

{
  "userId": 1,
  "reason": "不想要了，申请取消订单"
}
```

---

## ⚠️ 重要提示

1. **价格快照**: 创建订单时，商品价格会从商品实体中获取并保存，即使后续商品价格变化，订单中的价格也不会改变。

2. **库存检查**: 创建订单时会自动检查库存，如果库存不足会抛出 `InsufficientStockException` 异常。

3. **自动计算**: 订单总金额 = 商品小计 + 运费 + 税费 - 折扣金额

4. **订单号**: 系统会自动生成唯一订单号（UUID格式），格式如：`550e8400-e29b-41d4-a716-446655440000`

5. **权限验证**: 
   - 取消订单需要验证用户ID是否为订单所有者
   - 删除订单通常需要管理员权限

---

**文档版本**: 1.0  
**最后更新**: 2025-01-XX

