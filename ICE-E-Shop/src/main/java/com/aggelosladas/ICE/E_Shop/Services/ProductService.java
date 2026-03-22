package com.aggelosladas.ICE.E_Shop.Services;

import com.aggelosladas.ICE.E_Shop.DTOs.AddProductDTO;
import com.aggelosladas.ICE.E_Shop.Models.CartItem;
import com.aggelosladas.ICE.E_Shop.Models.Product;
import com.aggelosladas.ICE.E_Shop.Repositories.CartItemRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.ProductRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository,
                          CartItemRepository cartItemRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public void addProduct(AddProductDTO addProductDTO) {
        Product newProduct = new Product();

        newProduct.setProductName(addProductDTO.getProductName());
        newProduct.setProductDescription(addProductDTO.getProductDescription());
        newProduct.setProductPrice(addProductDTO.getProductPrice());
        newProduct.setProductImage(addProductDTO.getProductImage());
        newProduct.setProductQuantity(addProductDTO.getProductQuantity());

        productRepository.save(newProduct);
    }

    public Optional<Product> findByProductCode(int product_code) {
        if  (productRepository.findByProductCode(product_code).isPresent()) {
            return productRepository.findByProductCode(product_code);
        }
        return Optional.empty();
    }

    public List<Product> showAll() {
        return productRepository.findAll();
    }

    public List<Product> showAllByOrderByProductNameAsc() {
        return productRepository.getAllByOrderByProductNameAsc();
    }

    public List<Product> showAllByOrderByProductPriceAsc() {
        return productRepository.getAllByOrderByProductPriceAsc();
    }

    public List<Product> showAllByOrderByProductPriceDesc() {
        return productRepository.getAllByOrderByProductPriceDesc();
    }

    @Transactional
    public void deleteByProductCode(int productCode) {
        Product product = productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + productCode));
        // Αφαίρεση από καλάθια πριν τη διαγραφή
        List<CartItem> cartItems = cartItemRepository.findByProduct_ProductCode(productCode);
        for (CartItem item : cartItems) {
            item.getShoppingCart().getCartItems().remove(item);
        }
        cartItemRepository.deleteAll(cartItems);
        productRepository.delete(product);
    }

}
