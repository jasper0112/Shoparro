# Product Module API 文档 - Postman 测试指南

## 📌 基础信息

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

## 📦 商品管理 API (`/products`)

### 1. 创建商品（商户）

**Endpoint**: `POST /api/products?merchantId={merchantId}`

**Query Parameters**:
- `merchantId` (Long, required) - 商户ID

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "iPhone 15 Pro",
  "description": "最新款iPhone，256GB存储，配备A17 Pro芯片",
  "price": 1299.00,
  "stock": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/images/iphone15.jpg",
  "imageUrls": "https://example.com/images/iphone15-1.jpg,https://example.com/images/iphone15-2.jpg",
  "status": "ACTIVE",
  "originalPrice": 1399.00,
  "sku": "IPH15-256-BLK",
  "brand": "Apple",
  "unit": "件",
  "specifications": "{\"color\":\"黑色\",\"storage\":\"256GB\",\"screen\":\"6.1英寸\"}"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "最新款iPhone，256GB存储，配备A17 Pro芯片",
  "price": 1299.00,
  "stock": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/images/iphone15.jpg",
  "imageUrls": "https://example.com/images/iphone15-1.jpg,https://example.com/images/iphone15-2.jpg",
  "status": "ACTIVE",
  "enabled": true,
  "originalPrice": 1399.00,
  "sku": "IPH15-256-BLK",
  "brand": "Apple",
  "unit": "件",
  "specifications": "{\"color\":\"黑色\",\"storage\":\"256GB\",\"screen\":\"6.1英寸\"}",
  "salesCount": 0,
  "viewCount": 0,
  "rating": 0.00,
  "reviewCount": 0,
  "merchantId": 1,
  "merchantName": "Jane's Electronics Store",
  "createdAt": "2025-01-XXTXX:XX:XX",
  "updatedAt": "2025-01-XXTXX:XX:XX"
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "只有商户可以创建商品"
}
```

**Error Response** (400 Bad Request - 验证失败):
```json
{
  "name": "商品名称不能为空",
  "price": "商品价格必须大于0",
  "stock": "库存数量不能为负数"
}
```

---

### 2. 根据ID获取商品

**Endpoint**: `GET /api/products/{id}`

**Path Parameters**:
- `id` (Long) - 商品ID

**Example**: `GET /api/products/1`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "description": "最新款iPhone，256GB存储",
  "price": 1299.00,
  "stock": 50,
  "category": "Electronics",
  "status": "ACTIVE",
  "enabled": true,
  "merchantId": 1,
  "merchantName": "Jane's Electronics Store",
  "viewCount": 1,
  ...
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "商品不存在，ID: 1"
}
```

---

### 3. 获取所有商品（分页）

**Endpoint**: `GET /api/products`

**Query Parameters**:
- `page` (int, default: 0) - 页码（从0开始）
- `size` (int, default: 20) - 每页数量
- `sortBy` (String, default: "createdAt") - 排序字段
- `sortDir` (String, default: "DESC") - 排序方向（ASC/DESC）

**Example**: `GET /api/products?page=0&size=20&sortBy=price&sortDir=ASC`

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "price": 1299.00,
      ...
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalElements": 100,
  "totalPages": 5,
  "last": false,
  "first": true
}
```

---

### 4. 获取所有上架商品（分页）

**Endpoint**: `GET /api/products/active`

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 20)
- `sortBy` (String, default: "createdAt")
- `sortDir` (String, default: "DESC")

**Example**: `GET /api/products/active?page=0&size=20`

---

### 5. 根据商户ID获取商品列表

**Endpoint**: `GET /api/products/merchant/{merchantId}`

**Path Parameters**:
- `merchantId` (Long) - 商户ID

**Example**: `GET /api/products/merchant/1`

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro",
    "price": 1299.00,
    ...
  },
  {
    "id": 2,
    "name": "MacBook Pro",
    "price": 1999.00,
    ...
  }
]
```

---

### 6. 根据商户ID获取商品列表（分页）

**Endpoint**: `GET /api/products/merchant/{merchantId}/page`

**Path Parameters**:
- `merchantId` (Long) - 商户ID

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 20)

**Example**: `GET /api/products/merchant/1/page?page=0&size=10`

---

### 7. 根据分类获取商品（分页）

**Endpoint**: `GET /api/products/category/{category}`

**Path Parameters**:
- `category` (String) - 商品分类

**Query Parameters**:
- `page` (int, default: 0)
- `size` (int, default: 20)

**Example**: `GET /api/products/category/Electronics?page=0&size=20`

---

### 8. 搜索商品

**Endpoint**: `GET /api/products/search`

**Query Parameters**:
- `keyword` (String, required) - 搜索关键词
- `page` (int, default: 0)
- `size` (int, default: 20)

**Example**: `GET /api/products/search?keyword=iPhone&page=0&size=20`

**Success Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "description": "最新款iPhone...",
      ...
    }
  ],
  "totalElements": 5,
  ...
}
```

---

### 9. 根据价格范围搜索商品

**Endpoint**: `GET /api/products/price-range`

**Query Parameters**:
- `minPrice` (BigDecimal, required) - 最低价格
- `maxPrice` (BigDecimal, required) - 最高价格
- `page` (int, default: 0)
- `size` (int, default: 20)

**Example**: `GET /api/products/price-range?minPrice=100&maxPrice=500&page=0&size=20`

---

### 10. 更新商品（商户）

**Endpoint**: `PUT /api/products/{id}?merchantId={merchantId}`

**Path Parameters**:
- `id` (Long) - 商品ID

**Query Parameters**:
- `merchantId` (Long, required) - 商户ID

**Headers**:
```
Content-Type: application/json
```

**Request Body** (所有字段都是可选的):
```json
{
  "name": "iPhone 15 Pro Updated",
  "description": "更新后的描述",
  "price": 1199.00,
  "stock": 30,
  "category": "Electronics",
  "status": "ACTIVE"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "name": "iPhone 15 Pro Updated",
  "price": 1199.00,
  "stock": 30,
  ...
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "商品不存在或您无权访问该商品"
}
```

**Error Response** (403 Forbidden):
```json
{
  "message": "商品不存在或您无权访问该商品"
}
```

---

### 11. 删除商品（商户）

**Endpoint**: `DELETE /api/products/{id}?merchantId={merchantId}`

**Path Parameters**:
- `id` (Long) - 商品ID

**Query Parameters**:
- `merchantId` (Long, required) - 商户ID

**Example**: `DELETE /api/products/1?merchantId=1`

**Success Response** (200 OK):
```json
{
  "message": "商品删除成功"
}
```

---

### 12. 更新商品库存

**Endpoint**: `PATCH /api/products/{id}/stock?quantity={quantity}`

**Path Parameters**:
- `id` (Long) - 商品ID

**Query Parameters**:
- `quantity` (Integer, required) - 库存变化量（正数增加，负数减少）

**Example**: 
- 增加库存: `PATCH /api/products/1/stock?quantity=10`
- 减少库存: `PATCH /api/products/1/stock?quantity=-5`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "stock": 55,
  ...
}
```

**Error Response** (400 Bad Request - 库存不足):
```json
{
  "message": "库存不足"
}
```

---

### 13. 启用/禁用商品

**Endpoint**: `PATCH /api/products/{id}/toggle-status?merchantId={merchantId}`

**Path Parameters**:
- `id` (Long) - 商品ID

**Query Parameters**:
- `merchantId` (Long, required) - 商户ID

**Example**: `PATCH /api/products/1/toggle-status?merchantId=1`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "enabled": false,
  ...
}
```

---

## 📋 数据字段说明

### ProductStatus 枚举值
- `ACTIVE` - 上架销售中
- `INACTIVE` - 下架
- `OUT_OF_STOCK` - 缺货
- `DISCONTINUED` - 停产/不再销售

### 必填字段验证规则

**创建商品时必填**:
- `name`: 非空，最大200字符
- `price`: 非空，必须大于0.01
- `stock`: 非空，不能为负数

### 可选字段
- `description`, `category`, `imageUrl`, `imageUrls`
- `originalPrice`, `sku`, `brand`, `unit`, `specifications`
- `status` (默认: ACTIVE)

---

## 🧪 Postman 测试步骤

### 1. 创建环境变量
在Postman中创建环境，设置变量：
- `base_url`: `http://localhost:8080/api`
- `merchant_id`: (从用户注册后获取)
- `product_id`: (创建商品后从响应中获取)

### 2. 测试流程建议

1. **创建商品**
   - 使用 `POST /api/products?merchantId={merchantId}` 创建商品
   - 保存返回的 `id` 用于后续测试

2. **查询商品**
   - 使用 `GET /api/products/{id}` 查询刚创建的商品
   - 使用 `GET /api/products` 获取所有商品
   - 使用 `GET /api/products/search?keyword=xxx` 搜索商品

3. **更新商品**
   - 使用 `PUT /api/products/{id}?merchantId={merchantId}` 更新商品信息
   - 使用 `PATCH /api/products/{id}/stock?quantity=-5` 更新库存

4. **测试错误场景**
   - 尝试用非商户用户创建商品
   - 尝试更新其他商户的商品
   - 尝试减少库存到负数

---

## ⚠️ 注意事项

1. **商户ID**: 创建和更新商品时必须提供有效的商户ID
2. **权限验证**: 商户只能操作自己的商品
3. **库存管理**: 库存为0时，商品状态会自动设置为OUT_OF_STOCK
4. **分页参数**: 所有分页接口都支持page和size参数

---

## 📝 快速测试示例

### 测试1: 创建商品
```bash
POST http://localhost:8080/api/products?merchantId=1
{
  "name": "MacBook Pro",
  "description": "14英寸 MacBook Pro",
  "price": 1999.00,
  "stock": 20,
  "category": "Electronics",
  "sku": "MBP14-512-SLV"
}
```

### 测试2: 搜索商品
```bash
GET http://localhost:8080/api/products/search?keyword=MacBook&page=0&size=10
```

### 测试3: 更新库存
```bash
PATCH http://localhost:8080/api/products/1/stock?quantity=-5
```

---

**文档版本**: 1.0  
**最后更新**: 2025-01-XX

