# Order Module 订单模块文档

## 📋 概述

Order模块负责处理 Southside Cart 平台的订单生命周期，包括下单、支付、发货、取消与售后等场景。订单与以下实体关联：

- 用户（`User`）：下单客户
- 商品（`Product`）：订单项引用商品快照
- 商户（`User`，角色为 `MERCHANT`）：供货方

## 🏗️ 项目结构

```
backend/src/main/java/com/example/backend/
├── order/
│   ├── Order.java                      # 订单实体
│   ├── OrderItem.java                  # 订单项实体
│   ├── OrderStatus.java                # 订单状态枚举
│   ├── OrderItemStatus.java            # 订单项状态枚举
│   ├── PaymentStatus.java              # 支付状态枚举
│   ├── PaymentMethod.java              # 支付方式枚举
│   ├── OrderRepository.java            # 订单数据访问层
│   ├── OrderItemRepository.java        # 订单项数据访问层
│   ├── OrderService.java               # 订单业务逻辑层
│   ├── OrderController.java            # 订单控制器
│   ├── dto/
│   │   ├── CreateOrderRequest.java
│   │   ├── OrderItemRequest.java
│   │   ├── OrderResponse.java
│   │   ├── OrderItemResponse.java
│   │   ├── UpdateOrderStatusRequest.java
│   │   ├── UpdatePaymentStatusRequest.java
│   │   └── CancelOrderRequest.java
│   └── exception/
│       ├── OrderCreationException.java
│       ├── OrderNotFoundException.java
│       ├── OrderStatusException.java
│       └── PaymentProcessingException.java
```

## 🗄️ 数据库表结构

### 表：`orders`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键，自增 |
| order_number | VARCHAR(40) | 订单编号（唯一） |
| user_id | BIGINT | 客户ID（外键） |
| status | VARCHAR(30) | 订单状态（`OrderStatus`） |
| payment_status | VARCHAR(30) | 支付状态（`PaymentStatus`） |
| payment_method | VARCHAR(30) | 支付方式 |
| subtotal | DECIMAL(12,2) | 商品小计 |
| shipping_fee | DECIMAL(12,2) | 运费 |
| tax_amount | DECIMAL(12,2) | 税费 |
| discount_amount | DECIMAL(12,2) | 折扣金额 |
| total_amount | DECIMAL(12,2) | 订单总金额 |
| shipping_name | VARCHAR(100) | 收件人姓名 |
| shipping_phone | VARCHAR(30) | 收件人电话 |
| shipping_address | VARCHAR(500) | 收货地址 |
| shipping_city | VARCHAR(100) | 城市 |
| shipping_postcode | VARCHAR(20) | 邮编 |
| shipping_country | VARCHAR(100) | 国家 |
| shipping_provider | VARCHAR(100) | 物流公司 |
| tracking_number | VARCHAR(100) | 物流单号 |
| payment_reference | VARCHAR(100) | 支付凭证号 |
| notes | VARCHAR(1000) | 订单备注 |
| cancellation_reason | VARCHAR(500) | 取消原因 |
| order_date | TIMESTAMP | 下单时间 |
| payment_date | TIMESTAMP | 支付时间 |
| shipped_date | TIMESTAMP | 发货时间 |
| delivered_date | TIMESTAMP | 送达时间 |
| cancelled_date | TIMESTAMP | 取消时间 |
| updated_at | TIMESTAMP | 最后更新时间 |

### 表：`order_items`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键，自增 |
| order_id | BIGINT | 订单ID（外键） |
| product_id | BIGINT | 商品ID（外键） |
| merchant_id | BIGINT | 商户ID（外键） |
| product_name | VARCHAR(200) | 商品名称快照 |
| product_sku | VARCHAR(50) | 商品SKU快照 |
| unit_price | DECIMAL(12,2) | 单价快照 |
| quantity | INT | 数量 |
| total_price | DECIMAL(12,2) | 小计 |
| status | VARCHAR(30) | 订单项状态 |
| notes | VARCHAR(500) | 备注 |

## 🔄 业务流程概述

1. **创建订单**：校验用户与商品、扣减库存、生成订单号
2. **支付**：更新支付状态及支付时间
3. **发货/配送**：更新物流信息、订单状态
4. **完成**：客户确认收货，状态变更为 `DELIVERED/COMPLETED`
5. **取消/退款**：恢复库存，记录原因

## 🔐 状态枚举

- `OrderStatus`: `PENDING_PAYMENT`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED`, `REFUNDED`
- `PaymentStatus`: `PENDING`, `PAID`, `REFUNDED`, `FAILED`, `PARTIALLY_PAID`
- `PaymentMethod`: `CREDIT_CARD`, `DEBIT_CARD`, `PAYPAL`, `WECHAT_PAY`, `ALIPAY`, `BANK_TRANSFER`, `CASH_ON_DELIVERY`
- `OrderItemStatus`: 与订单状态保持一致（项级别）

## 🔌 API 概览

- `POST /api/orders` — 创建订单
- `GET /api/orders/{id}` — 查看订单详情
- `GET /api/orders/user/{userId}` — 用户订单列表（分页）
- `GET /api/orders/merchant/{merchantId}` — 商户相关订单（分页）
- `GET /api/orders` — 全部订单（分页/筛选）
- `GET /api/orders/status/{status}` — 按状态筛选
- `PUT /api/orders/{id}/status` — 更新订单状态
- `PUT /api/orders/{id}/payment-status` — 更新支付状态
- `POST /api/orders/{id}/cancel` — 取消订单并恢复库存
- `DELETE /api/orders/{id}` — 删除订单（管理员）

详细 API 说明请参考 `ORDER_API_DOCUMENTATION.md`。

## 🚀 快速测试

1. 创建用户/商户与商品
2. 使用 `POST /api/orders` 创建订单
3. 调用支付接口更新状态
4. 更新物流信息
5. 测试取消和库存恢复

## ⚠️ 注意事项

- 下单时会实时扣减商品库存
- 取消订单会自动恢复库存
- 当前尚未集成真正的支付网关与鉴权，`userId/merchantId` 通过请求参数/Body 传入
- 可根据业务需要扩展发票、优惠券、物流追踪等功能

