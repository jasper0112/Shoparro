package com.example.backend.product;

import com.example.backend.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品实体类
 * 使用JPA注解，数据库表会自动生成
 */
@Entity
@Table(name = "products", indexes = {
    @Index(name = "idx_merchant_id", columnList = "merchant_id"),
    @Index(name = "idx_status", columnList = "status"),
    @Index(name = "idx_category", columnList = "category"),
    @Index(name = "idx_name", columnList = "name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String name;
    
    @Column(length = 2000)
    private String description;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false)
    private Integer stock = 0;
    
    @Column(length = 100)
    private String category;
    
    @Column(length = 500)
    private String imageUrl;
    
    @Column(length = 1000)
    private String imageUrls; // 多张图片URL，用逗号分隔
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status = ProductStatus.ACTIVE;
    
    @Column(nullable = false)
    private Boolean enabled = true;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice; // 原价（用于显示折扣）
    
    @Column(length = 50)
    private String sku; // 商品SKU编码
    
    @Column(length = 100)
    private String brand; // 品牌
    
    @Column(length = 50)
    private String unit; // 单位（如：件、kg、L等）
    
    @Column(columnDefinition = "TEXT")
    private String specifications; // 商品规格（JSON格式存储）
    
    @Column
    private Integer salesCount = 0; // 销售数量
    
    @Column
    private Integer viewCount = 0; // 浏览次数
    
    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.ZERO; // 评分（0-5）
    
    @Column
    private Integer reviewCount = 0; // 评价数量
    
    // 关联商户（商品所属的商户）
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "merchant_id", nullable = false)
    private User merchant;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}

