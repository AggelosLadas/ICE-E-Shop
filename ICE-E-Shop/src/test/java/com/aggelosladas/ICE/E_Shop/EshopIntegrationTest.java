package com.aggelosladas.ICE.E_Shop;

import com.aggelosladas.ICE.E_Shop.DTOs.AddProductDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.AddToCartDTO;
import com.aggelosladas.ICE.E_Shop.DTOs.UserRegisterDTO;
import com.aggelosladas.ICE.E_Shop.Models.Product;
import com.aggelosladas.ICE.E_Shop.Models.ShoppingCart;
import com.aggelosladas.ICE.E_Shop.Models.User;
import com.aggelosladas.ICE.E_Shop.Repositories.ProductRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.jpa.properties.hibernate.globally_quoted_identifiers=true") // Fixes the H2 "user" keyword bug
@AutoConfigureMockMvc
@Transactional // Wipes the DB clean after every single test method!
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY) // Uses H2 In-Memory DB
public class EshopIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

   //public endpoints tests
    @Test
    void shouldRegisterNewUserSuccessfully() throws Exception {
        // Arrange
        UserRegisterDTO dto = new UserRegisterDTO("new_student", "password123", "student2@uni.edu");

        // Act & Assert
        mockMvc.perform(post("/users/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void shouldAllowPublicAccessToShowAllProducts() throws Exception {
        mockMvc.perform(get("/products/showAll"))
                .andExpect(status().isOk());
    }

    //secured endpoints (mazi me jwt)
    @Test
    void shouldBlockUnauthenticatedAccessToCart() throws Exception {
        // No @WithMockUser - should be blocked by JwtAuthenticationFilter
        mockMvc.perform(get("/users/cart"))
                .andExpect(status().isUnauthorized()); // 401 Unauthorized
    }

    @Test
    @WithMockUser(username = "test_student", roles = "USER")
    void shouldAllowAuthenticatedUserToAddToCart() throws Exception {
        // 1. ARRANGE: Create the User
        User user = new User();
        user.setUsername("test_student");
        user.setEmail("student@uni.edu");
        user.setPassword("password123");
        user.setRole("USER");

        // Give the user an empty shopping cart
        ShoppingCart cart = new ShoppingCart();
        cart.setOwner(user);
        cart.setCartItems(new ArrayList<>());
        user.setShopping_cart(cart);

        // Save User (also saves the Cart due to CascadeType.ALL)
        userRepository.save(user);

        // Create the Product
        Product product = new Product();
        product.setProductName("Test Laptop");
        product.setProductPrice(999.99);
        product.setProductCode(123456);
        productRepository.save(product);

        // DTO for matching
        AddToCartDTO cartDto = new AddToCartDTO("test_student", 123456, 2);

        // request
        mockMvc.perform(post("/users/add/cart")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cartDto)))
                .andExpect(status().isOk());
    }

    //test gia admin

    @Test
    @WithMockUser(username = "normal_user", roles = "USER")
    void shouldForbidNormalUserFromAddingProduct() throws Exception {
        AddProductDTO productDto = new AddProductDTO("Laptop", "Gaming PC", 1500.0, "img.png", 5);

        mockMvc.perform(post("/products/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isForbidden()); // 403 Forbidden
    }

    @Test
    @WithMockUser(username = "admin_user", roles = "ADMIN")
    void shouldAllowAdminToAddProduct() throws Exception {
        AddProductDTO productDto = new AddProductDTO("Laptop", "Gaming PC", 1500.0, "img.png", 5);

        mockMvc.perform(post("/products/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productDto)))
                .andExpect(status().isOk());
    }
}