# User Module API 快速参考

## 🔗 基础URL
```
http://localhost:8080/api
```

---

## 📋 API 列表

### 🔐 认证 API

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/login` | 用户登录 |

### 👥 用户管理 API

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/users` | 获取所有用户 |
| GET | `/users/{id}` | 根据ID获取用户 |
| GET | `/users/role/{role}` | 根据角色获取用户列表 |
| PUT | `/users/{id}` | 更新用户信息 |
| DELETE | `/users/{id}` | 删除用户 |
| PATCH | `/users/{id}/toggle-status` | 启用/禁用用户 |

---

## 📦 请求/响应示例

### 1. 注册 (POST /auth/register)
```json
// Request
{
  "username": "customer001",
  "email": "customer001@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}

// Response (201)
{
  "id": 1,
  "username": "customer001",
  "email": "customer001@example.com",
  "role": "CUSTOMER",
  "enabled": true,
  ...
}
```

### 2. 登录 (POST /auth/login)
```json
// Request
{
  "email": "customer001@example.com",
  "password": "password123"
}

// Response (200)
{
  "token": "jwt-token-placeholder",
  "user": { ... }
}
```

### 3. 获取用户 (GET /users/{id})
```json
// Response (200)
{
  "id": 1,
  "username": "customer001",
  "email": "customer001@example.com",
  "role": "CUSTOMER",
  ...
}
```

### 4. 更新用户 (PUT /users/{id})
```json
// Request
{
  "firstName": "John Updated",
  "phone": "0498765432"
}

// Response (200)
{
  "id": 1,
  "firstName": "John Updated",
  "phone": "0498765432",
  ...
}
```

---

## 🎯 用户角色 (UserRole)

- `CUSTOMER` - 普通用户
- `ADMIN` - 管理员
- `MERCHANT` - 商户

---

## ⚠️ 错误响应格式

```json
{
  "message": "错误信息"
}
```

常见HTTP状态码:
- `400` - 请求参数错误
- `401` - 未授权（登录失败）
- `404` - 资源不存在
- `409` - 冲突（用户已存在）
- `500` - 服务器错误

---

## 📝 字段验证规则

| 字段 | 规则 |
|------|------|
| username | 必填，3-50字符 |
| email | 必填，有效邮箱格式，最大100字符 |
| password | 必填，6-100字符 |

---

## 🚀 Postman 导入

1. 打开 Postman
2. 点击 Import
3. 选择文件: `User_Module_API.postman_collection.json`
4. 设置环境变量 `base_url` = `http://localhost:8080/api`

---

详细文档请查看: `API_DOCUMENTATION.md`

