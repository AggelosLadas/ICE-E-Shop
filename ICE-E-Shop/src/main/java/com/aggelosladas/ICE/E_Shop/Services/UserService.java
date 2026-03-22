package com.aggelosladas.ICE.E_Shop.Services;

import com.aggelosladas.ICE.E_Shop.DTOs.LoginResponseDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.UserLoginDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.UserRegisterDTO;
import com.aggelosladas.ICE.E_Shop.Security.JwtUtil;
import com.aggelosladas.ICE.E_Shop.Models.CartItem;
import com.aggelosladas.ICE.E_Shop.Models.Product;
import com.aggelosladas.ICE.E_Shop.Models.ShoppingCart;
import com.aggelosladas.ICE.E_Shop.Models.User;
import com.aggelosladas.ICE.E_Shop.Repositories.CartItemRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.ProductRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.ShoppingCartRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ShoppingCartRepository shoppingCartRepository, ProductRepository productRepository, CartItemRepository cartItemRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.shoppingCartRepository = shoppingCartRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(UserRegisterDTO userDTO){
        User newUser = new User();
        newUser.setUsername(userDTO.getUsername());
        newUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        newUser.setEmail(userDTO.getEmail());

        ShoppingCart shoppingCart = new ShoppingCart();
        shoppingCart.setOwner(newUser);
        newUser.setShopping_cart(shoppingCart);
        userRepository.save(newUser);
        shoppingCartRepository.save(shoppingCart);
    }

    public LoginResponseDTO loginUser(UserLoginDTO userLoginDTO){
        User user = userRepository.findByEmail(userLoginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("User not found");
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return new LoginResponseDTO(token, user.getUsername(), user.getEmail(), user.getRole());
    }

    @Transactional
    public void addProductToCart(String username, int productCode, int quantity) {
        if (quantity <= 0) quantity = 1;

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found" + username));

        Product product = productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new EntityNotFoundException("Product not found" + productCode));

        ShoppingCart shoppingCart = user.getShopping_cart();
        Optional<CartItem> existingItem = shoppingCart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductCode() == productCode)
                .findFirst();
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(product);
            newItem.setShoppingCart(shoppingCart);
            newItem.setQuantity(quantity);
            cartItemRepository.save(newItem);
            shoppingCart.getCartItems().add(newItem);
        }
        shoppingCartRepository.save(shoppingCart);
    }

    @Transactional
    public List<CartItem> getCartItems(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        ShoppingCart cart = user.getShopping_cart();
        if (cart == null || cart.getCartItems() == null) {
            return new ArrayList<>();
        }
        return cart.getCartItems();
    }

    @Transactional
    public void removeProductFromCart(String username, int productCode) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        ShoppingCart cart = user.getShopping_cart();
        CartItem itemToRemove = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProductCode() == productCode)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found for product: " + productCode));
        cart.getCartItems().remove(itemToRemove);
        cartItemRepository.delete(itemToRemove);
        shoppingCartRepository.save(cart);
    }

    @Transactional
    public void updateCartItemQuantity(String username, int productCode, int quantity) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        ShoppingCart cart = user.getShopping_cart();
        CartItem item = cart.getCartItems().stream()
                .filter(ci -> ci.getProduct().getProductCode() == productCode)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found for product: " + productCode));
        if (quantity <= 0) {
            cart.getCartItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
        }
        shoppingCartRepository.save(cart);
    }

    @Transactional
    public void clearCart(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        ShoppingCart cart = user.getShopping_cart();
        if (cart.getCartItems() != null) {
            cartItemRepository.deleteAll(cart.getCartItems());
            cart.getCartItems().clear();
            shoppingCartRepository.save(cart);
        }
    }
}
