package com.example.backend.product.dto;

import com.example.backend.product.ProductStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 更新商品请求DTO
 */
@Data
public class UpdateProductRequest {
    
    @Size(max = 200, message = "商品名称长度不能超过200个字符")
    private String name;
    
    @Size(max = 2000, message = "商品描述长度不能超过2000个字符")
    private String description;
    
    @DecimalMin(value = "0.01", message = "商品价格必须大于0")
    private BigDecimal price;
    
    @Min(value = 0, message = "库存数量不能为负数")
    private Integer stock;
    
    @Size(max = 100, message = "分类长度不能超过100个字符")
    private String category;
    
    @Size(max = 500, message = "图片URL长度不能超过500个字符")
    private String imageUrl;
    
    @Size(max = 1000, message = "图片URLs长度不能超过1000个字符")
    private String imageUrls;
    
    private ProductStatus status;
    
    private Boolean enabled;
    
    @DecimalMin(value = "0.01", message = "原价必须大于0")
    private BigDecimal originalPrice;
    
    @Size(max = 50, message = "SKU长度不能超过50个字符")
    private String sku;
    
    @Size(max = 100, message = "品牌长度不能超过100个字符")
    private String brand;
    
    @Size(max = 50, message = "单位长度不能超过50个字符")
    private String unit;
    
    private String specifications;
}

