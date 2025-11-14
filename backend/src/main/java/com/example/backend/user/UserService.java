package com.example.backend.user;

import com.example.backend.user.dto.LoginRequest;
import com.example.backend.user.dto.RegisterRequest;
import com.example.backend.user.dto.UpdateUserRequest;
import com.example.backend.user.dto.UserResponse;
import com.example.backend.user.exception.InvalidCredentialsException;
import com.example.backend.user.exception.UserAlreadyExistsException;
import com.example.backend.user.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户服务层
 */
@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * 用户注册
     */
    public UserResponse register(RegisterRequest request) {
        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("该邮箱已被注册");
        }
        
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("该用户名已被使用");
        }
        
        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER);
        user.setEnabled(true);
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPostcode(request.getPostcode());
        user.setCountry(request.getCountry());
        
        // 如果是商户，设置商户特有字段
        if (request.getRole() == UserRole.MERCHANT) {
            user.setBusinessName(request.getBusinessName());
            user.setBusinessLicense(request.getBusinessLicense());
            user.setBusinessDescription(request.getBusinessDescription());
        }
        
        User savedUser = userRepository.save(user);
        return UserResponse.fromUser(savedUser);
    }
    
    /**
     * 用户登录验证
     */
    public User validateLogin(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("邮箱或密码错误"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("邮箱或密码错误");
        }
        
        if (!user.getEnabled()) {
            throw new InvalidCredentialsException("账户已被禁用");
        }
        
        // 更新最后登录时间
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        return user;
    }
    
    /**
     * 根据ID获取用户
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("用户不存在，ID: " + id));
        return UserResponse.fromUser(user);
    }
    
    /**
     * 根据邮箱获取用户
     */
    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("用户不存在，邮箱: " + email));
        return UserResponse.fromUser(user);
    }
    
    /**
     * 获取所有用户
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据角色获取用户列表
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(UserRole role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }
    
    /**
     * 更新用户信息
     */
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("用户不存在，ID: " + id));
        
        // 更新字段
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            // 检查新用户名是否已被其他用户使用
            if (!user.getUsername().equals(request.getUsername()) && 
                userRepository.existsByUsername(request.getUsername())) {
                throw new UserAlreadyExistsException("该用户名已被使用");
            }
            user.setUsername(request.getUsername());
        }
        
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            // 检查新邮箱是否已被其他用户使用
            if (!user.getEmail().equals(request.getEmail()) && 
                userRepository.existsByEmail(request.getEmail())) {
                throw new UserAlreadyExistsException("该邮箱已被注册");
            }
            user.setEmail(request.getEmail());
        }
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        
        if (request.getPostcode() != null) {
            user.setPostcode(request.getPostcode());
        }
        
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        
        // 商户特有字段
        if (user.getRole() == UserRole.MERCHANT) {
            if (request.getBusinessName() != null) {
                user.setBusinessName(request.getBusinessName());
            }
            if (request.getBusinessLicense() != null) {
                user.setBusinessLicense(request.getBusinessLicense());
            }
            if (request.getBusinessDescription() != null) {
                user.setBusinessDescription(request.getBusinessDescription());
            }
        }
        
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }
    
    /**
     * 删除用户
     */
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("用户不存在，ID: " + id);
        }
        userRepository.deleteById(id);
    }
    
    /**
     * 启用/禁用用户
     */
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("用户不存在，ID: " + id));
        user.setEnabled(!user.getEnabled());
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }
}

