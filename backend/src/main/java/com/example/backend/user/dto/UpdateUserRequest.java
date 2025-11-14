package com.example.backend.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 更新用户信息请求DTO
 */
@Data
public class UpdateUserRequest {
    
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间")
    private String username;
    
    @Email(message = "邮箱格式不正确")
    @Size(max = 100, message = "邮箱长度不能超过100个字符")
    private String email;
    
    @Size(min = 6, max = 100, message = "密码长度必须在6-100个字符之间")
    private String password;
    
    private String firstName;
    
    private String lastName;
    
    private String phone;
    
    private String address;
    
    private String city;
    
    private String postcode;
    
    private String country;
    
    // 商户特有字段
    private String businessName;
    
    private String businessLicense;
    
    private String businessDescription;
}

