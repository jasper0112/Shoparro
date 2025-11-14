package com.example.backend.order;

import com.example.backend.order.dto.*;
import com.example.backend.order.exception.OrderCreationException;
import com.example.backend.order.exception.OrderNotFoundException;
import com.example.backend.order.exception.OrderStatusException;
import com.example.backend.product.Product;
import com.example.backend.product.ProductRepository;
import com.example.backend.product.ProductStatus;
import com.example.backend.product.exception.ProductNotFoundException;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import com.example.backend.user.exception.UserNotFoundException;
import com.example.backend.product.exception.InsufficientStockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * 订单服务层
 */
@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * 创建订单
     */
    public OrderResponse createOrder(CreateOrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new OrderCreationException("订单至少包含一个商品");
        }

        User customer = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserNotFoundException("用户不存在，ID: " + request.getUserId()));

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setCustomer(customer);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setShippingName(request.getShippingName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setShippingCity(request.getShippingCity());
        order.setShippingPostcode(request.getShippingPostcode());
        order.setShippingCountry(request.getShippingCountry());
        order.setNotes(request.getNotes());
        order.setItems(new java.util.ArrayList<>());

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ProductNotFoundException("商品不存在，ID: " + itemRequest.getProductId()));

            if (!Boolean.TRUE.equals(product.getEnabled()) || product.getStatus() == ProductStatus.INACTIVE) {
                throw new OrderCreationException("商品已下架或不可用: " + product.getName());
            }

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new InsufficientStockException("商品库存不足: " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(totalPrice);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setMerchant(product.getMerchant());
            orderItem.setProductName(product.getName());
            orderItem.setProductSku(product.getSku());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setTotalPrice(totalPrice);
            orderItem.setNotes(itemRequest.getNotes());
            order.getItems().add(orderItem);

            // 更新商品库存与销量
            product.setStock(product.getStock() - itemRequest.getQuantity());
            product.setSalesCount(product.getSalesCount() + itemRequest.getQuantity());
            if (product.getStock() == 0) {
                product.setStatus(ProductStatus.OUT_OF_STOCK);
            }
        }

        BigDecimal shippingFee = defaultIfNull(request.getShippingFee());
        BigDecimal taxAmount = defaultIfNull(request.getTaxAmount());
        BigDecimal discountAmount = clampDiscount(defaultIfNull(request.getDiscountAmount()), subtotal);

        BigDecimal totalAmount = subtotal.add(shippingFee).add(taxAmount).subtract(discountAmount);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setTaxAmount(taxAmount);
        order.setDiscountAmount(discountAmount);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    /**
     * 根据ID获取订单
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("订单不存在，ID: " + id));
        return OrderResponse.fromEntity(order);
    }

    /**
     * 根据订单号获取订单
     */
    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException("订单不存在，编号: " + orderNumber));
        return OrderResponse.fromEntity(order);
    }

    /**
     * 获取用户订单列表
     */
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByCustomerId(userId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 获取用户订单（分页）
     */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUser(Long userId, Pageable pageable) {
        return orderRepository.findByCustomerId(userId, pageable)
                .map(OrderResponse::fromEntity);
    }

    /**
     * 获取商户相关订单（包含其商品的订单）
     */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByMerchant(Long merchantId, Pageable pageable) {
        return orderRepository.findByMerchantId(merchantId, pageable)
                .map(OrderResponse::fromEntity);
    }

    /**
     * 获取全部订单（分页）
     */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable)
                .map(OrderResponse::fromEntity);
    }

    /**
     * 根据状态获取订单（分页）
     */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByStatus(OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable)
                .map(OrderResponse::fromEntity);
    }

    /**
     * 更新订单状态
     */
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("订单不存在，ID: " + orderId));

        if (order.getStatus() == OrderStatus.CANCELLED) {
            throw new OrderStatusException("订单已取消，无法更新状态");
        }

        order.setStatus(request.getStatus());
        if (request.getStatus() == OrderStatus.SHIPPED) {
            order.setShippedDate(LocalDateTime.now());
        } else if (request.getStatus() == OrderStatus.DELIVERED || request.getStatus() == OrderStatus.COMPLETED) {
            order.setDeliveredDate(LocalDateTime.now());
        }

        order.setShippingProvider(request.getShippingProvider());
        order.setTrackingNumber(request.getTrackingNumber());
        order.setNotes(request.getNotes());

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    /**
     * 更新支付状态
     */
    public OrderResponse updatePaymentStatus(Long orderId, UpdatePaymentStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("订单不存在，ID: " + orderId));

        order.setPaymentStatus(request.getPaymentStatus());
        order.setPaymentReference(request.getPaymentReference());
        if (request.getPaymentStatus() == PaymentStatus.PAID) {
            order.setStatus(OrderStatus.PROCESSING);
            order.setPaymentDate(request.getPaidAt() != null ? request.getPaidAt() : LocalDateTime.now());
        } else if (request.getPaymentStatus() == PaymentStatus.REFUNDED) {
            order.setStatus(OrderStatus.REFUNDED);
        } else if (request.getPaymentStatus() == PaymentStatus.FAILED) {
            order.setStatus(OrderStatus.PENDING_PAYMENT);
        }

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    /**
     * 取消订单
     */
    public OrderResponse cancelOrder(Long orderId, CancelOrderRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("订单不存在，ID: " + orderId));

        if (!order.getCustomer().getId().equals(request.getUserId())) {
            throw new OrderStatusException("只能取消自己的订单");
        }

        if (order.getStatus() == OrderStatus.SHIPPED || order.getStatus() == OrderStatus.DELIVERED
                || order.getStatus() == OrderStatus.COMPLETED) {
            throw new OrderStatusException("当前状态无法取消订单");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatus.FAILED);
        order.setCancellationReason(request.getReason());
        order.setCancelledDate(LocalDateTime.now());

        // 恢复库存
        order.getItems().forEach(item -> {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            if (product.getStock() > 0 && product.getStatus() == ProductStatus.OUT_OF_STOCK) {
                product.setStatus(ProductStatus.ACTIVE);
            }
        });

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    /**
     * 删除订单（仅管理员使用）
     */
    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new OrderNotFoundException("订单不存在，ID: " + orderId);
        }
        orderRepository.deleteById(orderId);
    }

    private BigDecimal defaultIfNull(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }

    private BigDecimal clampDiscount(BigDecimal discount, BigDecimal subtotal) {
        if (discount.compareTo(subtotal) > 0) {
            return subtotal;
        }
        return discount;
    }

    private String generateOrderNumber() {
        return "ORD-" + LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}

