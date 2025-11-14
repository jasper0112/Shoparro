# Product Module API 快速参考

## 🔗 基础URL
```
http://localhost:8080/api
```

---

## 📋 API 列表

### 📦 商品管理 API

| 方法 | 端点 | 是否需要请求体 | 说明 |
|------|------|--------------|------|
| POST | `/products?merchantId={id}` | ✅ 需要 | 创建商品（商户） |
| GET | `/products/{id}` | ❌ 不需要 | 根据ID获取商品 |
| GET | `/products` | ❌ 不需要 | 获取所有商品（分页） |
| GET | `/products/active` | ❌ 不需要 | 获取所有上架商品（分页） |
| GET | `/products/merchant/{merchantId}` | ❌ 不需要 | 根据商户ID获取商品列表 |
| GET | `/products/merchant/{merchantId}/page` | ❌ 不需要 | 根据商户ID获取商品（分页） |
| GET | `/products/category/{category}` | ❌ 不需要 | 根据分类获取商品（分页） |
| GET | `/products/search?keyword={keyword}` | ❌ 不需要 | 搜索商品 |
| GET | `/products/price-range?minPrice={min}&maxPrice={max}` | ❌ 不需要 | 根据价格范围搜索商品 |
| PUT | `/products/{id}?merchantId={id}` | ✅ 需要 | 更新商品（商户） |
| DELETE | `/products/{id}?merchantId={id}` | ❌ 不需要 | 删除商品（商户） |
| PATCH | `/products/{id}/stock?quantity={qty}` | ❌ 不需要 | 更新商品库存 |
| PATCH | `/products/{id}/toggle-status?merchantId={id}` | ❌ 不需要 | 启用/禁用商品 |

**总计**: 13个API，其中2个需要请求体

---

## 📦 请求/响应示例

### 1. 创建商品 (POST /products?merchantId={id})
```json
// Request
{
  "name": "iPhone 15 Pro",
  "description": "最新款iPhone",
  "price": 1299.00,
  "stock": 50,
  "category": "Electronics",
  "sku": "IPH15-256-BLK"
}

// Response (201)
{
  "id": 1,
  "name": "iPhone 15 Pro",
  "price": 1299.00,
  "stock": 50,
  "merchantId": 1,
  ...
}
```

### 2. 更新商品 (PUT /products/{id}?merchantId={id})
```json
// Request
{
  "name": "iPhone 15 Pro Updated",
  "price": 1199.00,
  "stock": 30
}

// Response (200)
{
  "id": 1,
  "name": "iPhone 15 Pro Updated",
  "price": 1199.00,
  "stock": 30,
  ...
}
```

---

## 🎯 商品状态 (ProductStatus)

- `ACTIVE` - 上架销售中
- `INACTIVE` - 下架
- `OUT_OF_STOCK` - 缺货
- `DISCONTINUED` - 停产/不再销售

---

## ⚠️ 错误响应格式

```json
{
  "message": "错误信息"
}
```

常见HTTP状态码:
- `400` - 请求参数错误
- `403` - 禁止访问（无权操作）
- `404` - 资源不存在
- `500` - 服务器错误

---

## 📝 字段验证规则

| 字段 | 规则 |
|------|------|
| name | 必填，最大200字符 |
| price | 必填，必须大于0.01 |
| stock | 必填，不能为负数 |

---

## 🔑 需要请求体的API数据结构

### 创建商品 (POST)
```json
{
  "name": "商品名称",           // 必填，最大200字符
  "description": "商品描述",     // 可选，最大2000字符
  "price": 1299.00,            // 必填，必须>0.01
  "stock": 50,                 // 必填，>=0
  "category": "分类",          // 可选
  "imageUrl": "图片URL",       // 可选
  "imageUrls": "多图URL",      // 可选
  "status": "ACTIVE",          // 可选，默认ACTIVE
  "originalPrice": 1399.00,    // 可选
  "sku": "SKU编码",            // 可选
  "brand": "品牌",             // 可选
  "unit": "单位",              // 可选
  "specifications": "规格JSON"  // 可选
}
```

### 更新商品 (PUT)
```json
{
  "name": "商品名称",           // 可选
  "description": "商品描述",     // 可选
  "price": 1299.00,            // 可选
  "stock": 50,                 // 可选
  "category": "分类",          // 可选
  "imageUrl": "图片URL",       // 可选
  "status": "ACTIVE",          // 可选
  "enabled": true,             // 可选
  // ... 其他字段都是可选的
}
```

---

## 🚀 Postman 导入

详细API文档和Postman Collection请查看: `PRODUCT_API_DOCUMENTATION.md`

---

详细文档请查看: `PRODUCT_API_DOCUMENTATION.md`

