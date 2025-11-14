# User Module 用户模块文档

## 📋 概述

User模块是Southside Cart电商平台的核心用户管理模块，支持三种用户角色：
- **CUSTOMER**: 普通用户
- **ADMIN**: 管理员
- **MERCHANT**: 商户

## 🏗️ 项目结构

```
backend/src/main/java/com/example/backend/
├── user/
│   ├── User.java                    # 用户实体类
│   ├── UserRole.java                # 用户角色枚举
│   ├── UserRepository.java          # 用户数据访问层
│   ├── UserService.java             # 用户业务逻辑层
│   ├── UserController.java          # 用户控制器
│   ├── dto/
│   │   ├── RegisterRequest.java     # 注册请求DTO
│   │   ├── LoginRequest.java        # 登录请求DTO
│   │   ├── UserResponse.java        # 用户响应DTO
│   │   └── UpdateUserRequest.java   # 更新用户请求DTO
│   └── exception/
│       ├── UserNotFoundException.java
│       ├── UserAlreadyExistsException.java
│       └── InvalidCredentialsException.java
├── auth/
│   └── AuthController.java          # 认证控制器（登录/注册）
├── config/
│   └── SecurityConfig.java          # Spring Security配置
└── exception/
    └── GlobalExceptionHandler.java  # 全局异常处理器
```

## 🗄️ 数据库表结构

User实体类会自动生成`users`表，包含以下字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | BIGINT | 主键，自增 |
| username | VARCHAR(50) | 用户名，唯一 |
| email | VARCHAR(100) | 邮箱，唯一 |
| password | VARCHAR | 密码（加密存储） |
| first_name | VARCHAR(50) | 名 |
| last_name | VARCHAR(50) | 姓 |
| phone | VARCHAR(20) | 电话 |
| role | VARCHAR(20) | 角色（CUSTOMER/ADMIN/MERCHANT） |
| enabled | BOOLEAN | 是否启用 |
| address | VARCHAR(500) | 地址 |
| city | VARCHAR(100) | 城市 |
| postcode | VARCHAR(20) | 邮编 |
| country | VARCHAR(50) | 国家 |
| business_name | VARCHAR(200) | 商户名称（商户特有） |
| business_license | VARCHAR(50) | 营业执照号（商户特有） |
| business_description | VARCHAR(500) | 商户描述（商户特有） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| last_login_at | TIMESTAMP | 最后登录时间 |

**注意**: 数据库表会在应用启动时自动创建（`ddl-auto: update`）

## 🔌 API接口

### 认证接口（/api/auth）

#### 1. 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "firstName": "Test",
  "lastName": "User",
  "phone": "1234567890",
  "role": "CUSTOMER"
}
```

**响应**:
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "role": "CUSTOMER",
  "enabled": true,
  "createdAt": "2025-01-XX..."
}
```

#### 2. 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "token": "jwt-token-placeholder",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "CUSTOMER",
    ...
  }
}
```

### 用户管理接口（/api/users）

#### 3. 获取所有用户
```http
GET /api/users
```

#### 4. 根据ID获取用户
```http
GET /api/users/{id}
```

#### 5. 根据角色获取用户列表
```http
GET /api/users/role/{role}
```
其中`{role}`可以是: `CUSTOMER`, `ADMIN`, `MERCHANT`

#### 6. 更新用户信息
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "firstName": "Updated",
  "phone": "9876543210"
}
```

#### 7. 删除用户
```http
DELETE /api/users/{id}
```

#### 8. 启用/禁用用户
```http
PATCH /api/users/{id}/toggle-status
```

## 🔐 安全配置

- 密码使用BCrypt加密存储
- `/api/auth/**` 和 `/api/users/register`, `/api/users/login` 路径允许匿名访问
- 其他用户管理接口需要认证（后续集成JWT后生效）
- CORS已配置，允许前端跨域访问

## 📝 使用示例

### 注册普通用户
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "customer1",
    "email": "customer1@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  }'
```

### 注册商户
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "merchant1",
    "email": "merchant1@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "MERCHANT",
    "businessName": "Jane's Shop",
    "businessLicense": "LIC123456",
    "businessDescription": "A great shop"
  }'
```

### 用户登录
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@example.com",
    "password": "password123"
  }'
```

## 🚀 启动应用

1. 确保数据库已配置并运行
2. 启动Spring Boot应用：
```bash
cd backend
./mvnw spring-boot:run
```

3. 应用启动后，数据库表会自动创建
4. 可以通过上述API接口进行测试

## ⚠️ 注意事项

1. **JWT Token**: 当前登录接口返回的是占位符token，需要后续实现JWT token生成和验证
2. **密码安全**: 生产环境建议使用更强的密码策略
3. **数据验证**: 所有输入都经过验证，确保数据完整性
4. **异常处理**: 全局异常处理器会统一处理所有异常并返回友好的错误信息

## 🔄 后续开发建议

1. 实现JWT token生成和验证
2. 添加用户头像上传功能
3. 实现用户邮箱验证
4. 添加密码重置功能
5. 实现用户权限管理（基于角色的访问控制）
6. 添加用户活动日志

