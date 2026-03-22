package com.aggelosladas.ICE.E_Shop.Repositories;

import com.aggelosladas.ICE.E_Shop.Models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    List<CartItem> findByProduct_ProductCode(int productCode);
}
