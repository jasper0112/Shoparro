package com.example.backend.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 商品数据访问层
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    /**
     * 根据商户ID查找商品
     */
    List<Product> findByMerchantId(Long merchantId);
    
    /**
     * 根据商户ID分页查找商品
     */
    Page<Product> findByMerchantId(Long merchantId, Pageable pageable);
    
    /**
     * 根据商户和状态查找商品
     */
    List<Product> findByMerchantIdAndStatus(Long merchantId, ProductStatus status);
    
    /**
     * 根据状态查找商品
     */
    List<Product> findByStatus(ProductStatus status);
    
    /**
     * 根据状态分页查找商品
     */
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    
    /**
     * 根据状态和启用状态分页查找商品
     */
    Page<Product> findByStatusAndEnabledTrue(ProductStatus status, Pageable pageable);
    
    /**
     * 根据分类查找商品
     */
    List<Product> findByCategory(String category);
    
    /**
     * 根据分类和状态查找商品
     */
    Page<Product> findByCategoryAndStatus(String category, ProductStatus status, Pageable pageable);
    
    /**
     * 根据商户ID和商品ID查找商品
     */
    Optional<Product> findByIdAndMerchantId(Long id, Long merchantId);
    
    /**
     * 搜索商品（根据名称或描述）
     */
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "p.status = :status AND p.enabled = true")
    Page<Product> searchProducts(@Param("keyword") String keyword, 
                                 @Param("status") ProductStatus status, 
                                 Pageable pageable);
    
    /**
     * 根据价格范围查找商品
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.status = :status AND p.enabled = true")
    Page<Product> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice,
                                   @Param("maxPrice") java.math.BigDecimal maxPrice,
                                   @Param("status") ProductStatus status,
                                   Pageable pageable);
    
    /**
     * 查找启用的商品
     */
    List<Product> findByEnabledTrue();
    
    /**
     * 查找启用的商品（分页）
     */
    Page<Product> findByEnabledTrue(Pageable pageable);
    
    /**
     * 根据商户ID和启用状态查找商品
     */
    List<Product> findByMerchantIdAndEnabledTrue(Long merchantId);
}

