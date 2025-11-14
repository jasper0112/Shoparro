package com.example.backend.product;

import com.example.backend.product.dto.CreateProductRequest;
import com.example.backend.product.dto.ProductResponse;
import com.example.backend.product.dto.UpdateProductRequest;
import com.example.backend.product.exception.ProductNotFoundException;
import com.example.backend.product.exception.UnauthorizedProductAccessException;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.user.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 商品服务层
 */
@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    /**
     * 创建商品（商户）
     */
    public ProductResponse createProduct(Long merchantId, CreateProductRequest request) {
        // 验证商户是否存在
        User merchant = userRepository.findById(merchantId)
                .orElseThrow(() -> new UserNotFoundException("商户不存在，ID: " + merchantId));
        
        // 验证是否为商户角色
        if (merchant.getRole() != com.example.backend.user.UserRole.MERCHANT) {
            throw new UnauthorizedProductAccessException("只有商户可以创建商品");
        }
        
        // 创建商品
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock() != null ? request.getStock() : 0);
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());
        product.setImageUrls(request.getImageUrls());
        product.setStatus(request.getStatus() != null ? request.getStatus() : ProductStatus.ACTIVE);
        product.setEnabled(true);
        product.setOriginalPrice(request.getOriginalPrice());
        product.setSku(request.getSku());
        product.setBrand(request.getBrand());
        product.setUnit(request.getUnit());
        product.setSpecifications(request.getSpecifications());
        product.setMerchant(merchant);
        product.setSalesCount(0);
        product.setViewCount(0);
        product.setRating(BigDecimal.ZERO);
        product.setReviewCount(0);
        
        Product savedProduct = productRepository.save(product);
        return ProductResponse.fromProduct(savedProduct);
    }
    
    /**
     * 根据ID获取商品
     */
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException("商品不存在，ID: " + id));
        
        // 增加浏览次数
        product.setViewCount(product.getViewCount() + 1);
        productRepository.save(product);
        
        return ProductResponse.fromProduct(product);
    }
    
    /**
     * 获取所有商品（分页）
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(ProductResponse::fromProduct);
    }
    
    /**
     * 获取所有上架商品（分页）
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getActiveProducts(Pageable pageable) {
        return productRepository.findByStatusAndEnabledTrue(ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::fromProduct);
    }
    
    /**
     * 根据商户ID获取商品列表
     */
    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByMerchantId(Long merchantId) {
        return productRepository.findByMerchantId(merchantId).stream()
                .map(ProductResponse::fromProduct)
                .collect(Collectors.toList());
    }
    
    /**
     * 根据商户ID获取商品列表（分页）
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByMerchantId(Long merchantId, Pageable pageable) {
        return productRepository.findByMerchantId(merchantId, pageable)
                .map(ProductResponse::fromProduct);
    }
    
    /**
     * 根据分类获取商品（分页）
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(String category, Pageable pageable) {
        return productRepository.findByCategoryAndStatus(category, ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::fromProduct);
    }
    
    /**
     * 搜索商品
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::fromProduct);
    }
    
    /**
     * 根据价格范围搜索商品
     */
    @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        return productRepository.findByPriceRange(minPrice, maxPrice, ProductStatus.ACTIVE, pageable)
                .map(ProductResponse::fromProduct);
    }
    
    /**
     * 更新商品（商户只能更新自己的商品）
     */
    public ProductResponse updateProduct(Long productId, Long merchantId, UpdateProductRequest request) {
        Product product = productRepository.findByIdAndMerchantId(productId, merchantId)
                .orElseThrow(() -> new ProductNotFoundException("商品不存在或您无权访问该商品"));
        
        // 更新字段
        if (request.getName() != null && !request.getName().isEmpty()) {
            product.setName(request.getName());
        }
        
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        
        if (request.getStock() != null) {
            product.setStock(request.getStock());
            // 如果库存为0，自动设置为缺货状态
            if (request.getStock() == 0 && product.getStatus() == ProductStatus.ACTIVE) {
                product.setStatus(ProductStatus.OUT_OF_STOCK);
            }
        }
        
        if (request.getCategory() != null) {
            product.setCategory(request.getCategory());
        }
        
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        
        if (request.getImageUrls() != null) {
            product.setImageUrls(request.getImageUrls());
        }
        
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        
        if (request.getEnabled() != null) {
            product.setEnabled(request.getEnabled());
        }
        
        if (request.getOriginalPrice() != null) {
            product.setOriginalPrice(request.getOriginalPrice());
        }
        
        if (request.getSku() != null) {
            product.setSku(request.getSku());
        }
        
        if (request.getBrand() != null) {
            product.setBrand(request.getBrand());
        }
        
        if (request.getUnit() != null) {
            product.setUnit(request.getUnit());
        }
        
        if (request.getSpecifications() != null) {
            product.setSpecifications(request.getSpecifications());
        }
        
        Product updatedProduct = productRepository.save(product);
        return ProductResponse.fromProduct(updatedProduct);
    }
    
    /**
     * 删除商品（商户只能删除自己的商品）
     */
    public void deleteProduct(Long productId, Long merchantId) {
        Product product = productRepository.findByIdAndMerchantId(productId, merchantId)
                .orElseThrow(() -> new ProductNotFoundException("商品不存在或您无权访问该商品"));
        productRepository.delete(product);
    }
    
    /**
     * 管理员删除商品
     */
    public void deleteProductByAdmin(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("商品不存在，ID: " + productId);
        }
        productRepository.deleteById(productId);
    }
    
    /**
     * 更新商品库存
     */
    public ProductResponse updateStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("商品不存在，ID: " + productId));
        
        int newStock = product.getStock() + quantity;
        if (newStock < 0) {
            throw new com.example.backend.product.exception.InsufficientStockException("库存不足");
        }
        
        product.setStock(newStock);
        
        // 如果库存为0，设置为缺货状态
        if (newStock == 0 && product.getStatus() == ProductStatus.ACTIVE) {
            product.setStatus(ProductStatus.OUT_OF_STOCK);
        }
        
        Product updatedProduct = productRepository.save(product);
        return ProductResponse.fromProduct(updatedProduct);
    }
    
    /**
     * 启用/禁用商品
     */
    public ProductResponse toggleProductStatus(Long productId, Long merchantId) {
        Product product = productRepository.findByIdAndMerchantId(productId, merchantId)
                .orElseThrow(() -> new ProductNotFoundException("商品不存在或您无权访问该商品"));
        
        product.setEnabled(!product.getEnabled());
        Product updatedProduct = productRepository.save(product);
        return ProductResponse.fromProduct(updatedProduct);
    }
}

