# 数据库配置信息

## ✅ 已配置的数据库连接

**数据库类型**: 阿里云 MySQL  
**服务器名称**: JasperD B  
**主机地址**: 47.107.131.134  
**端口**: 3306  
**数据库名**: shoparro  
**用户名**: root  
**密码**: jfq123 (已配置)

## 📝 配置文件位置

所有配置已更新到以下文件：

1. **主配置文件**: `src/main/resources/application.yml`
   - 默认使用此配置
   - 数据库连接已配置

2. **开发环境**: `src/main/resources/application-dev.yml`
   - 使用 `--spring.profiles.active=dev` 激活

3. **生产环境**: `src/main/resources/application-prod.yml`
   - 使用 `--spring.profiles.active=prod` 激活

## 🔧 连接字符串

```
jdbc:mysql://47.107.131.134:3306/shoparro?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true
```

## ⚠️ 安全建议

**重要**: 当前密码直接写在配置文件中。为了安全，建议：

1. **使用环境变量**（推荐）:
   ```bash
   export DB_USERNAME=root
   export DB_PASSWORD=jfq123
   ```
   然后配置文件中使用 `${DB_USERNAME}` 和 `${DB_PASSWORD}`

2. **生产环境**:
   - 不要将包含密码的配置文件提交到 Git
   - 使用环境变量或密钥管理服务
   - 考虑将 `application-prod.yml` 添加到 `.gitignore`

3. **更新 .gitignore**:
   确保敏感配置文件不会被提交

## 🚀 测试连接

启动应用测试数据库连接：

```bash
cd backend
./mvnw spring-boot:run
```

如果连接成功，您会看到类似以下日志：
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

如果连接失败，检查：
1. 阿里云 RDS 白名单是否包含您的 IP 地址
2. 数据库 `shoparro` 是否已创建
3. 用户名和密码是否正确
4. 网络连接是否正常

## 📋 创建数据库（如果尚未创建）

连接到 MySQL 并执行：

```sql
CREATE DATABASE IF NOT EXISTS shoparro 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

## 🔗 相关文件

- `src/main/resources/application.yml` - 主配置
- `src/main/resources/application-dev.yml` - 开发环境
- `src/main/resources/application-prod.yml` - 生产环境
- `pom.xml` - Maven 依赖配置

---

**配置完成时间**: 2025年1月  
**状态**: ✅ 已配置，可以启动应用测试连接

