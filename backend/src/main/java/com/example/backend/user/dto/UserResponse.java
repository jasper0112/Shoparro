package com.example.backend.user.dto;

import com.example.backend.user.User;
import com.example.backend.user.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 用户响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private UserRole role;
    private Boolean enabled;
    private String address;
    private String city;
    private String postcode;
    private String country;
    private String businessName;
    private String businessLicense;
    private String businessDescription;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLoginAt;
    
    /**
     * 从User实体转换为UserResponse
     */
    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.getEnabled())
                .address(user.getAddress())
                .city(user.getCity())
                .postcode(user.getPostcode())
                .country(user.getCountry())
                .businessName(user.getBusinessName())
                .businessLicense(user.getBusinessLicense())
                .businessDescription(user.getBusinessDescription())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}

