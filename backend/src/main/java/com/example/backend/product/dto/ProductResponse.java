package com.example.backend.product.dto;

import com.example.backend.product.Product;
import com.example.backend.product.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 商品响应DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String category;
    private String imageUrl;
    private String imageUrls;
    private ProductStatus status;
    private Boolean enabled;
    private BigDecimal originalPrice;
    private String sku;
    private String brand;
    private String unit;
    private String specifications;
    private Integer salesCount;
    private Integer viewCount;
    private BigDecimal rating;
    private Integer reviewCount;
    private Long merchantId;
    private String merchantName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * 从Product实体转换为ProductResponse
     */
    public static ProductResponse fromProduct(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .imageUrls(product.getImageUrls())
                .status(product.getStatus())
                .enabled(product.getEnabled())
                .originalPrice(product.getOriginalPrice())
                .sku(product.getSku())
                .brand(product.getBrand())
                .unit(product.getUnit())
                .specifications(product.getSpecifications())
                .salesCount(product.getSalesCount())
                .viewCount(product.getViewCount())
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .merchantId(product.getMerchant() != null ? product.getMerchant().getId() : null)
                .merchantName(product.getMerchant() != null ? 
                    (product.getMerchant().getBusinessName() != null ? 
                        product.getMerchant().getBusinessName() : 
                        product.getMerchant().getUsername()) : null)
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}

