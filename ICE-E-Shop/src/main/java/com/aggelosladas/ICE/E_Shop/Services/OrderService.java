package com.aggelosladas.ICE.E_Shop.Services;

import com.aggelosladas.ICE.E_Shop.DTOs.CheckoutDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.CheckoutItemDTO;
import com.aggelosladas.ICE.E_Shop.Models.*;
import com.aggelosladas.ICE.E_Shop.Repositories.CartItemRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.OrderRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.ProductRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        ProductRepository productRepository,
                        CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public Order processCheckout(CheckoutDTO checkoutDTO) {
        if (checkoutDTO.getItems() == null || checkoutDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("Cart is empty");
        }

        User user = userRepository.findByUsername(checkoutDTO.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + checkoutDTO.getUsername()));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("COMPLETED");
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderItems(new ArrayList<>());

        double totalPrice = 0;

        for (CheckoutItemDTO itemDTO : checkoutDTO.getItems()) {
            Product product = productRepository.findByProductCode(itemDTO.getProductCode())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + itemDTO.getProductCode()));

            if (product.getProductQuantity() < itemDTO.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getProductName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setPriceAtPurchase(product.getProductPrice());
            order.getOrderItems().add(orderItem);

            totalPrice += product.getProductPrice() * itemDTO.getQuantity();

            product.setProductQuantity(product.getProductQuantity() - itemDTO.getQuantity());
            productRepository.save(product);
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        clearCartItemsForOrder(user, checkoutDTO.getItems());

        return savedOrder;
    }

    private void clearCartItemsForOrder(User user, List<CheckoutItemDTO> items) {
        ShoppingCart cart = user.getShopping_cart();
        if (cart == null || cart.getCartItems() == null) return;

        for (CheckoutItemDTO itemDTO : items) {
            for (CartItem cartItem : new ArrayList<>(cart.getCartItems())) {
                if (cartItem.getProduct().getProductCode() == itemDTO.getProductCode()) {
                    int newQty = cartItem.getQuantity() - itemDTO.getQuantity();
                    if (newQty <= 0) {
                        cart.getCartItems().remove(cartItem);
                        cartItemRepository.deleteById(cartItem.getId());
                    } else {
                        cartItem.setQuantity(newQty);
                        cartItemRepository.save(cartItem);
                    }
                    break;
                }
            }
        }
    }

    public List<Order> getOrdersByUsername(String username) {
        return orderRepository.findByUser_UsernameOrderByCreatedAtDesc(username);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
