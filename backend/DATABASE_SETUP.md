# 阿里云 MySQL 数据库配置指南

## 📋 配置步骤

### 1. 获取阿里云 RDS MySQL 连接信息

在阿里云控制台中获取以下信息：
- **数据库地址 (Endpoint)**: `your-rds-endpoint.mysql.rds.aliyuncs.com`
- **端口**: 通常是 `3306`
- **数据库名称**: 例如 `southside_cart`
- **用户名**: 您的数据库用户名
- **密码**: 您的数据库密码

### 2. 配置 application.yml

编辑 `src/main/resources/application.yml` 文件，更新以下配置：

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-rds-endpoint.mysql.rds.aliyuncs.com:3306/southside_cart?useSSL=true&requireSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true
    username: your_username
    password: your_password
```

### 3. 使用环境变量（推荐）

为了安全，建议使用环境变量配置数据库连接：

**Linux/macOS:**
```bash
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
export DB_HOST=your-rds-endpoint.mysql.rds.aliyuncs.com
export DB_PORT=3306
export DB_NAME=southside_cart
```

**Windows:**
```cmd
set DB_USERNAME=your_username
set DB_PASSWORD=your_password
set DB_HOST=your-rds-endpoint.mysql.rds.aliyuncs.com
set DB_PORT=3306
set DB_NAME=southside_cart
```

然后在 `application.yml` 中使用：
```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?useSSL=true&requireSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

### 4. 创建数据库

在阿里云 RDS 控制台或使用 MySQL 客户端创建数据库：

```sql
CREATE DATABASE southside_cart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 配置白名单

在阿里云 RDS 控制台中，将您的应用服务器 IP 地址添加到白名单，允许连接数据库。

### 6. 测试连接

启动应用后，检查日志确认数据库连接成功：

```bash
cd backend
./mvnw spring-boot:run
```

如果连接成功，您会看到类似以下日志：
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

## 🔒 安全建议

1. **使用环境变量**: 不要在代码中硬编码数据库密码
2. **使用 SSL 连接**: 生产环境建议启用 SSL (`useSSL=true&requireSSL=true`)
3. **限制 IP 访问**: 在阿里云 RDS 白名单中只添加必要的 IP
4. **定期更换密码**: 定期更新数据库密码
5. **使用强密码**: 确保数据库密码足够复杂

## 🚀 不同环境配置

### 开发环境
使用 `application-dev.yml`:
```bash
java -jar app.jar --spring.profiles.active=dev
```

### 生产环境
使用 `application-prod.yml`:
```bash
java -jar app.jar --spring.profiles.active=prod
```

## 📝 常见问题

### 连接超时
- 检查白名单配置
- 确认网络连接
- 检查防火墙设置

### SSL 错误
- 开发环境可以设置 `useSSL=false`
- 生产环境建议使用 `useSSL=true&requireSSL=true`

### 时区问题
- 已配置 `serverTimezone=Asia/Shanghai`
- 如需其他时区，请相应修改

## 🔗 相关链接

- [阿里云 RDS MySQL 文档](https://help.aliyun.com/product/26090.html)
- [MySQL Connector/J 文档](https://dev.mysql.com/doc/connector-j/8.0/en/)
- [Spring Boot 数据库配置](https://spring.io/guides/gs/accessing-data-mysql/)

