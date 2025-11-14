# User Module API 文档 - Postman 测试指南

## 📌 基础信息

- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

## 🔐 认证相关 API (`/auth`)

### 1. 用户注册

**Endpoint**: `POST /api/auth/register`

**Headers**:
```
Content-Type: application/json
```

**Request Body** (注册普通用户):
```json
{
  "username": "customer001",
  "email": "customer001@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0412345678",
  "role": "CUSTOMER",
  "address": "123 Main Street",
  "city": "Sydney",
  "postcode": "2000",
  "country": "Australia"
}
```

**Request Body** (注册商户):
```json
{
  "username": "merchant001",
  "email": "merchant001@example.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "0423456789",
  "role": "MERCHANT",
  "address": "456 Business Ave",
  "city": "Melbourne",
  "postcode": "3000",
  "country": "Australia",
  "businessName": "Jane's Electronics Store",
  "businessLicense": "ABN123456789",
  "businessDescription": "A leading electronics retailer in Melbourne"
}
```

**Request Body** (注册管理员 - 通常由系统创建):
```json
{
  "username": "admin001",
  "email": "admin001@example.com",
  "password": "admin123456",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "0434567890",
  "role": "ADMIN"
}
```

**Success Response** (201 Created):
```json
{
  "id": 1,
  "username": "customer001",
  "email": "customer001@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0412345678",
  "role": "CUSTOMER",
  "enabled": true,
  "address": "123 Main Street",
  "city": "Sydney",
  "postcode": "2000",
  "country": "Australia",
  "businessName": null,
  "businessLicense": null,
  "businessDescription": null,
  "createdAt": "2025-01-XXTXX:XX:XX",
  "updatedAt": "2025-01-XXTXX:XX:XX",
  "lastLoginAt": null
}
```

**Error Response** (409 Conflict - 用户已存在):
```json
{
  "message": "该邮箱已被注册"
}
```

**Error Response** (400 Bad Request - 验证失败):
```json
{
  "username": "用户名长度必须在3-50个字符之间",
  "email": "邮箱格式不正确",
  "password": "密码长度必须在6-100个字符之间"
}
```

---

### 2. 用户登录

**Endpoint**: `POST /api/auth/login`

**Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "customer001@example.com",
  "password": "password123"
}
```

**Success Response** (200 OK):
```json
{
  "token": "jwt-token-placeholder",
  "user": {
    "id": 1,
    "username": "customer001",
    "email": "customer001@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0412345678",
    "role": "CUSTOMER",
    "enabled": true,
    "address": "123 Main Street",
    "city": "Sydney",
    "postcode": "2000",
    "country": "Australia",
    "businessName": null,
    "businessLicense": null,
    "businessDescription": null,
    "createdAt": "2025-01-XXTXX:XX:XX",
    "updatedAt": "2025-01-XXTXX:XX:XX",
    "lastLoginAt": "2025-01-XXTXX:XX:XX"
  }
}
```

**Error Response** (401 Unauthorized - 凭证错误):
```json
{
  "message": "邮箱或密码错误"
}
```

**Error Response** (401 Unauthorized - 账户被禁用):
```json
{
  "message": "账户已被禁用"
}
```

**Error Response** (400 Bad Request - 验证失败):
```json
{
  "email": "邮箱格式不正确",
  "password": "密码不能为空"
}
```

---

## 👥 用户管理 API (`/users`)

### 3. 获取所有用户

**Endpoint**: `GET /api/users`

**Headers**: (当前无需认证，后续需要JWT token)
```
Content-Type: application/json
```

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "username": "customer001",
    "email": "customer001@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0412345678",
    "role": "CUSTOMER",
    "enabled": true,
    "address": "123 Main Street",
    "city": "Sydney",
    "postcode": "2000",
    "country": "Australia",
    "businessName": null,
    "businessLicense": null,
    "businessDescription": null,
    "createdAt": "2025-01-XXTXX:XX:XX",
    "updatedAt": "2025-01-XXTXX:XX:XX",
    "lastLoginAt": "2025-01-XXTXX:XX:XX"
  },
  {
    "id": 2,
    "username": "merchant001",
    "email": "merchant001@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "0423456789",
    "role": "MERCHANT",
    "enabled": true,
    "address": "456 Business Ave",
    "city": "Melbourne",
    "postcode": "3000",
    "country": "Australia",
    "businessName": "Jane's Electronics Store",
    "businessLicense": "ABN123456789",
    "businessDescription": "A leading electronics retailer in Melbourne",
    "createdAt": "2025-01-XXTXX:XX:XX",
    "updatedAt": "2025-01-XXTXX:XX:XX",
    "lastLoginAt": null
  }
]
```

---

### 4. 根据ID获取用户

**Endpoint**: `GET /api/users/{id}`

**Path Parameters**:
- `id` (Long) - 用户ID

**Example**: `GET /api/users/1`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "username": "customer001",
  "email": "customer001@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0412345678",
  "role": "CUSTOMER",
  "enabled": true,
  "address": "123 Main Street",
  "city": "Sydney",
  "postcode": "2000",
  "country": "Australia",
  "businessName": null,
  "businessLicense": null,
  "businessDescription": null,
  "createdAt": "2025-01-XXTXX:XX:XX",
  "updatedAt": "2025-01-XXTXX:XX:XX",
  "lastLoginAt": "2025-01-XXTXX:XX:XX"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "用户不存在，ID: 1"
}
```

---

### 5. 根据角色获取用户列表

**Endpoint**: `GET /api/users/role/{role}`

**Path Parameters**:
- `role` (String) - 用户角色，可选值: `CUSTOMER`, `ADMIN`, `MERCHANT`

**Examples**:
- `GET /api/users/role/CUSTOMER`
- `GET /api/users/role/MERCHANT`
- `GET /api/users/role/ADMIN`

**Success Response** (200 OK):
```json
[
  {
    "id": 1,
    "username": "customer001",
    "email": "customer001@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "0412345678",
    "role": "CUSTOMER",
    "enabled": true,
    "address": "123 Main Street",
    "city": "Sydney",
    "postcode": "2000",
    "country": "Australia",
    "businessName": null,
    "businessLicense": null,
    "businessDescription": null,
    "createdAt": "2025-01-XXTXX:XX:XX",
    "updatedAt": "2025-01-XXTXX:XX:XX",
    "lastLoginAt": "2025-01-XXTXX:XX:XX"
  }
]
```

---

### 6. 更新用户信息

**Endpoint**: `PUT /api/users/{id}`

**Path Parameters**:
- `id` (Long) - 用户ID

**Headers**:
```
Content-Type: application/json
```

**Request Body** (所有字段都是可选的):
```json
{
  "username": "customer001_updated",
  "email": "customer001_updated@example.com",
  "password": "newpassword123",
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "0498765432",
  "address": "789 New Street",
  "city": "Brisbane",
  "postcode": "4000",
  "country": "Australia"
}
```

**Request Body** (更新商户信息):
```json
{
  "businessName": "Updated Business Name",
  "businessLicense": "ABN987654321",
  "businessDescription": "Updated business description"
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "username": "customer001_updated",
  "email": "customer001_updated@example.com",
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "0498765432",
  "role": "CUSTOMER",
  "enabled": true,
  "address": "789 New Street",
  "city": "Brisbane",
  "postcode": "4000",
  "country": "Australia",
  "businessName": null,
  "businessLicense": null,
  "businessDescription": null,
  "createdAt": "2025-01-XXTXX:XX:XX",
  "updatedAt": "2025-01-XXTXX:XX:XX",
  "lastLoginAt": "2025-01-XXTXX:XX:XX"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "用户不存在，ID: 1"
}
```

**Error Response** (409 Conflict - 邮箱/用户名已存在):
```json
{
  "message": "该邮箱已被注册"
}
```

**Error Response** (400 Bad Request - 验证失败):
```json
{
  "username": "用户名长度必须在3-50个字符之间",
  "email": "邮箱格式不正确"
}
```

---

### 7. 删除用户

**Endpoint**: `DELETE /api/users/{id}`

**Path Parameters**:
- `id` (Long) - 用户ID

**Example**: `DELETE /api/users/1`

**Success Response** (200 OK):
```json
{
  "message": "用户删除成功"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "用户不存在，ID: 1"
}
```

---

### 8. 启用/禁用用户

**Endpoint**: `PATCH /api/users/{id}/toggle-status`

**Path Parameters**:
- `id` (Long) - 用户ID

**Example**: `PATCH /api/users/1/toggle-status`

**Success Response** (200 OK):
```json
{
  "id": 1,
  "username": "customer001",
  "email": "customer001@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0412345678",
  "role": "CUSTOMER",
  "enabled": false,
  "address": "123 Main Street",
  "city": "Sydney",
  "postcode": "2000",
  "country": "Australia",
  "businessName": null,
  "businessLicense": null,
  "businessDescription": null,
  "createdAt": "2025-01-XXTXX:XX:XX",
  "updatedAt": "2025-01-XXTXX:XX:XX",
  "lastLoginAt": "2025-01-XXTXX:XX:XX"
}
```

**Error Response** (404 Not Found):
```json
{
  "message": "用户不存在，ID: 1"
}
```

---

## 📋 数据字段说明

### UserRole 枚举值
- `CUSTOMER` - 普通用户
- `ADMIN` - 管理员
- `MERCHANT` - 商户

### 必填字段验证规则

**注册时必填**:
- `username`: 3-50个字符
- `email`: 有效邮箱格式，最大100个字符
- `password`: 6-100个字符

**登录时必填**:
- `email`: 有效邮箱格式
- `password`: 非空

### 可选字段
- `firstName`, `lastName`, `phone`
- `address`, `city`, `postcode`, `country`
- `businessName`, `businessLicense`, `businessDescription` (仅商户)

---

## 🧪 Postman 测试步骤

### 1. 创建环境变量（可选）
在Postman中创建环境，设置变量：
- `base_url`: `http://localhost:8080/api`
- `user_id`: (注册后从响应中获取)

### 2. 测试流程建议

1. **注册用户**
   - 使用 `POST /api/auth/register` 注册一个普通用户
   - 保存返回的 `id` 用于后续测试

2. **登录**
   - 使用 `POST /api/auth/login` 登录
   - 保存返回的 `token` (当前为占位符)

3. **查询用户**
   - 使用 `GET /api/users/{id}` 查询刚注册的用户
   - 使用 `GET /api/users` 获取所有用户
   - 使用 `GET /api/users/role/CUSTOMER` 获取特定角色用户

4. **更新用户**
   - 使用 `PUT /api/users/{id}` 更新用户信息

5. **测试错误场景**
   - 尝试注册重复邮箱
   - 尝试登录错误密码
   - 尝试查询不存在的用户ID

---

## ⚠️ 注意事项

1. **当前JWT Token**: 登录接口返回的token是占位符，实际JWT功能待实现
2. **认证**: 当前 `/api/users/**` 路径在SecurityConfig中配置为需要认证，但JWT验证尚未实现，所以目前可以访问
3. **CORS**: 已配置允许 `http://localhost:3000` 和 `http://localhost:3001` 跨域访问
4. **数据库**: 确保数据库连接正常，应用启动时会自动创建表结构

---

## 📝 快速测试示例

### 测试1: 注册并登录
```bash
# 1. 注册
POST http://localhost:8080/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123456"
}

# 2. 登录
POST http://localhost:8080/api/auth/login
{
  "email": "test@example.com",
  "password": "test123456"
}
```

### 测试2: 注册商户
```bash
POST http://localhost:8080/api/auth/register
{
  "username": "merchant_test",
  "email": "merchant@example.com",
  "password": "merchant123",
  "role": "MERCHANT",
  "businessName": "Test Store",
  "businessLicense": "ABN123456"
}
```

---

**文档版本**: 1.0  
**最后更新**: 2025-01-XX

