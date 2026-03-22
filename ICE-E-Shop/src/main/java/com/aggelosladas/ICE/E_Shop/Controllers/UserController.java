package com.aggelosladas.ICE.E_Shop.Controllers;

import com.aggelosladas.ICE.E_Shop.DTOs.AddToCartDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.CheckoutDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.LoginResponseDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.UpdateCartItemDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.UserLoginDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.UserRegisterDTO;
import com.aggelosladas.ICE.E_Shop.Models.CartItem;
import com.aggelosladas.ICE.E_Shop.Models.Order;
import com.aggelosladas.ICE.E_Shop.Services.OrderService;
import com.aggelosladas.ICE.E_Shop.Services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
//swagger ui : http://localhost:8080/swagger-ui/index.html
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;
    private final OrderService orderService;

    public UserController(UserService userService, OrderService orderService) {
        this.userService = userService;
        this.orderService = orderService;
    }

    @PostMapping("/add")
    public void register(@RequestBody UserRegisterDTO userRegisterDTO){
        userService.registerUser(userRegisterDTO);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody UserLoginDTO userLoginDTO){
        return userService.loginUser(userLoginDTO);
    }

    @PostMapping("/add/cart")
    public void addToShoppingCart(@RequestBody AddToCartDTO addToCartDTO){
        userService.addProductToCart(addToCartDTO.getUsername(), addToCartDTO.getProductCode(), addToCartDTO.getQuantity());
    }

    @GetMapping("/cart")
    public ResponseEntity<List<CartItem>> getCart(Authentication authentication) {
        String username = authentication.getName();
        List<CartItem> items = userService.getCartItems(username);
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/cart/{productCode}")
    public ResponseEntity<?> removeFromCart(@PathVariable int productCode, Authentication authentication) {
        try {
            String username = authentication.getName();
            userService.removeProductFromCart(username, productCode);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/cart")
    public ResponseEntity<?> updateCartItemQuantity(@RequestBody UpdateCartItemDTO dto, Authentication authentication) {
        try {
            String username = authentication.getName();
            userService.updateCartItemQuantity(username, dto.getProductCode(), dto.getQuantity());
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/cart/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        String username = authentication.getName();
        userService.clearCart(username);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutDTO checkoutDTO) {
        try {
            Order order = orderService.processCheckout(checkoutDTO);
            return ResponseEntity.ok(order);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Σφάλμα κατά το checkout: " + e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestParam String username) {
        return orderService.getOrdersByUsername(username);
    }

    @GetMapping("/orders/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
}
