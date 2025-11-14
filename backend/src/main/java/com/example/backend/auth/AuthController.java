package com.example.backend.auth;

import com.example.backend.user.User;
import com.example.backend.user.UserService;
import com.example.backend.user.dto.LoginRequest;
import com.example.backend.user.dto.RegisterRequest;
import com.example.backend.user.dto.UserResponse;
import com.example.backend.user.exception.InvalidCredentialsException;
import com.example.backend.user.exception.UserAlreadyExistsException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证控制器
 * 处理登录、注册等认证相关请求
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户登录
     * 匹配前端期望的路径: /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = userService.validateLogin(request);
            UserResponse userResponse = UserResponse.fromUser(user);
            
            // 这里应该生成JWT token，暂时返回用户信息
            // TODO: 集成JWT token生成
            Map<String, Object> response = new HashMap<>();
            response.put("token", "jwt-token-placeholder"); // 后续需要实现JWT
            response.put("user", userResponse);
            
            return ResponseEntity.ok(response);
        } catch (InvalidCredentialsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "登录失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * 用户注册
     * 匹配前端期望的路径: /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            UserResponse user = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (UserAlreadyExistsException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "注册失败: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

