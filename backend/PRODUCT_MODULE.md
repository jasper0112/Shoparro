# Product Module 商品模块文档

## 📋 概述

Product模块是Southside Cart电商平台的核心商品管理模块，支持商户创建、管理和销售商品。

## 🏗️ 项目结构

```
backend/src/main/java/com/example/backend/
├── product/
│   ├── Product.java                    # 商品实体类
│   ├── ProductStatus.java              # 商品状态枚举
│   ├── ProductRepository.java          # 商品数据访问层
│   ├── ProductService.java             # 商品业务逻辑层
│   ├── ProductController.java          # 商品控制器
│   ├── dto/
│   │   ├── CreateProductRequest.java   # 创建商品请求DTO
│   │   ├── UpdateProductRequest.java   # 更新商品请求DTO
│   │   └── ProductResponse.java        # 商品响应DTO
│   └── exception/
│       ├── ProductNotFoundException.java
│       ├── InsufficientStockException.java
│       └── UnauthorizedProductAccessException.java
```

## 🗄️ 数据库表结构

Product实体类会自动生成`products`表，包含以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| name | VARCHAR(200) | 商品名称 |
| description | VARCHAR(2000) | 商品描述 |
| price | DECIMAL(10,2) | 商品价格 |
| stock | INT | 库存数量 |
| category | VARCHAR(100) | 商品分类 |
| image_url | VARCHAR(500) | 主图片URL |
| image_urls | VARCHAR(1000) | 多张图片URL（逗号分隔） |
| status | VARCHAR(20) | 商品状态（ACTIVE/INACTIVE/OUT_OF_STOCK/DISCONTINUED） |
| enabled | BOOLEAN | 是否启用 |
| original_price | DECIMAL(10,2) | 原价（用于显示折扣） |
| sku | VARCHAR(50) | 商品SKU编码 |
| brand | VARCHAR(100) | 品牌 |
| unit | VARCHAR(50) | 单位（件、kg、L等） |
| specifications | TEXT | 商品规格（JSON格式） |
| sales_count | INT | 销售数量 |
| view_count | INT | 浏览次数 |
| rating | DECIMAL(3,2) | 评分（0-5） |
| review_count | INT | 评价数量 |
| merchant_id | BIGINT | 商户ID（外键关联users表） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**注意**: 数据库表会在应用启动时自动创建（`ddl-auto: update`）

## 🔌 API接口

### 商品管理接口（/api/products）

#### 1. 创建商品（商户）
```http
POST /api/products?merchantId=1
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "最新款iPhone，256GB存储",
  "price": 1299.00,
  "stock": 50,
  "category": "Electronics",
  "imageUrl": "https://example.com/iphone15.jpg",
  "sku": "IPH15-256-BLK",
  "brand": "Apple",
  "unit": "件"
}
```

**响应**:
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
  "createdAt": "2025-01-XX..."
}
```

#### 2. 根据ID获取商品
```http
GET /api/products/{id}
```

#### 3. 获取所有商品（分页）
```http
GET /api/products?page=0&size=20&sortBy=createdAt&sortDir=DESC
```

#### 4. 获取所有上架商品（分页）
```http
GET /api/products/active?page=0&size=20
```

#### 5. 根据商户ID获取商品列表
```http
GET /api/products/merchant/{merchantId}
```

#### 6. 根据分类获取商品（分页）
```http
GET /api/products/category/{category}?page=0&size=20
```

#### 7. 搜索商品
```http
GET /api/products/search?keyword=iPhone&page=0&size=20
```

#### 8. 根据价格范围搜索商品
```http
GET /api/products/price-range?minPrice=100&maxPrice=500&page=0&size=20
```

#### 9. 更新商品（商户）
```http
PUT /api/products/{id}?merchantId=1
Content-Type: application/json

{
  "name": "iPhone 15 Pro Updated",
  "price": 1199.00,
  "stock": 30
}
```

#### 10. 删除商品（商户）
```http
DELETE /api/products/{id}?merchantId=1
```

#### 11. 更新商品库存
```http
PATCH /api/products/{id}/stock?quantity=-10
```

#### 12. 启用/禁用商品
```http
PATCH /api/products/{id}/toggle-status?merchantId=1
```

## 🔐 权限说明

- **商户**: 只能创建、更新、删除自己的商品
- **管理员**: 可以管理所有商品
- **普通用户**: 只能查看上架的商品

## 📝 商品状态说明

- `ACTIVE`: 上架销售中
- `INACTIVE`: 下架（不显示）
- `OUT_OF_STOCK`: 缺货
- `DISCONTINUED`: 停产/不再销售

## 🚀 使用示例

### 创建商品
```bash
curl -X POST "http://localhost:8080/api/products?merchantId=1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro",
    "description": "14英寸 MacBook Pro",
    "price": 1999.00,
    "stock": 20,
    "category": "Electronics",
    "sku": "MBP14-512-SLV"
  }'
```

### 搜索商品
```bash
curl "http://localhost:8080/api/products/search?keyword=MacBook&page=0&size=10"
```

### 更新商品库存
```bash
curl -X PATCH "http://localhost:8080/api/products/1/stock?quantity=-5"
```

## ⚠️ 注意事项

1. **商户关联**: 创建商品时必须提供有效的商户ID
2. **库存管理**: 库存为0时，商品状态会自动设置为OUT_OF_STOCK
3. **权限验证**: 商户只能操作自己的商品
4. **数据验证**: 所有输入都经过验证，确保数据完整性

## 🔄 后续开发建议

1. 实现商品图片上传功能
2. 添加商品分类管理
3. 实现商品评价和评分功能
4. 添加商品推荐算法
5. 实现商品库存预警
6. 添加商品批量导入/导出功能

