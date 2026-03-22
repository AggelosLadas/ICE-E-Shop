package com.aggelosladas.ICE.E_Shop.Repositories;

import com.aggelosladas.ICE.E_Shop.Models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Optional<Product> findByProductCode(int product_code);
    Optional<Product> getByProductCode(int product_code);
    List<Product> getAllByOrderByProductNameAsc();

    List<Product> getAllByOrderByProductPriceAsc();
    List<Product> getAllByOrderByProductPriceDesc();

}
