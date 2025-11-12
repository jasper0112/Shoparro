# 数据库迁移总结：PostgreSQL → 阿里云 MySQL

## ✅ 已完成的更改

### 1. README.md 更新
- ✅ 将数据库技术栈从 PostgreSQL 更新为阿里云 MySQL
- ✅ 更新了部署建议中的数据库信息
- ✅ 更新了配置说明

### 2. Maven 配置 (pom.xml)
- ✅ 创建了 `backend/pom.xml` 文件
- ✅ 配置了 MySQL Connector/J 依赖 (`mysql-connector-j`)
- ✅ 移除了 PostgreSQL 相关依赖（如果之前存在）
- ✅ 配置了 Spring Boot 3.2.0 和 Java 17
- ✅ 包含了必要的依赖：
  - Spring Boot Web
  - Spring Data JPA
  - Spring Security
  - JWT 支持
  - MySQL Connector

### 3. 数据库配置文件
- ✅ 创建了 `application.yml` - 主配置文件
  - 配置了阿里云 MySQL 连接
  - 配置了 HikariCP 连接池（针对阿里云 RDS 优化）
  - 配置了 JPA/Hibernate 使用 MySQL8Dialect
  - 支持环境变量配置
  
- ✅ 创建了 `application-prod.yml` - 生产环境配置
  - 使用环境变量配置数据库连接
  - 优化了连接池设置
  - 关闭了 SQL 日志输出
  
- ✅ 创建了 `application-dev.yml` - 开发环境配置
  - 本地开发数据库配置
  - 启用了 SQL 日志

### 4. 文档
- ✅ 创建了 `DATABASE_SETUP.md` - 详细的数据库配置指南

## 📝 需要手动配置的内容

### 1. 更新数据库连接信息

编辑 `backend/src/main/resources/application.yml`，将以下占位符替换为实际的阿里云 RDS 信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-rds-endpoint.mysql.rds.aliyuncs.com:3306/shoparro?...
    username: ${DB_USERNAME:your_username}  # 替换 your_username
    password: ${DB_PASSWORD:your_password}   # 替换 your_password
```

### 2. 设置环境变量（推荐）

```bash
export DB_USERNAME=your_actual_username
export DB_PASSWORD=your_actual_password
export DB_HOST=your-rds-endpoint.mysql.rds.aliyuncs.com
export DB_PORT=3306
export DB_NAME=shoparro
```

### 3. 在阿里云 RDS 中创建数据库

```sql
CREATE DATABASE shoparro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 配置白名单

在阿里云 RDS 控制台中，将应用服务器的 IP 地址添加到白名单。

## 🔄 从 PostgreSQL 迁移到 MySQL 的注意事项

### SQL 语法差异

如果项目中有自定义 SQL 查询，需要注意以下差异：

1. **字符串连接**
   - PostgreSQL: `||`
   - MySQL: `CONCAT()` 或 `||` (MySQL 8.0+)

2. **日期函数**
   - PostgreSQL: `NOW()`, `CURRENT_TIMESTAMP`
   - MySQL: `NOW()`, `CURRENT_TIMESTAMP` (相同)

3. **分页**
   - PostgreSQL: `LIMIT n OFFSET m`
   - MySQL: `LIMIT m, n` 或 `LIMIT n OFFSET m` (MySQL 5.0+)

4. **布尔值**
   - PostgreSQL: `TRUE/FALSE`
   - MySQL: `1/0` 或 `TRUE/FALSE` (MySQL 5.0+)

### JPA/Hibernate 配置

已自动配置为使用 `MySQL8Dialect`，大部分 JPA 注解和查询应该可以直接使用。

### 数据类型映射

| PostgreSQL | MySQL |
|------------|-------|
| SERIAL | AUTO_INCREMENT |
| TEXT | TEXT 或 VARCHAR(65535) |
| BOOLEAN | TINYINT(1) 或 BOOLEAN |
| TIMESTAMP | DATETIME 或 TIMESTAMP |

## 🚀 下一步

1. **更新数据库连接信息** - 在 `application.yml` 中配置实际的阿里云 RDS 连接
2. **测试连接** - 启动应用并验证数据库连接
3. **迁移数据** (如果有现有数据) - 使用数据迁移工具从 PostgreSQL 迁移到 MySQL
4. **更新实体类** (如果需要) - 检查实体类中的注解是否与 MySQL 兼容
5. **测试功能** - 全面测试应用功能确保一切正常

## 📚 相关文件

- `backend/pom.xml` - Maven 项目配置
- `backend/src/main/resources/application.yml` - 主配置文件
- `backend/src/main/resources/application-prod.yml` - 生产环境配置
- `backend/src/main/resources/application-dev.yml` - 开发环境配置
- `backend/DATABASE_SETUP.md` - 详细配置指南
- `README.md` - 项目文档（已更新）

## ⚠️ 重要提示

1. **备份数据**: 如果有现有数据，迁移前务必备份
2. **测试环境**: 建议先在测试环境验证配置
3. **连接安全**: 生产环境建议启用 SSL 连接
4. **性能优化**: 根据实际负载调整连接池参数

---

**迁移完成时间**: 2025年1月  
**状态**: ✅ 配置已完成，等待数据库连接信息更新

