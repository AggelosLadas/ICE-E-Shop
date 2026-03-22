package com.aggelosladas.ICE.E_Shop.Repositories;

import com.aggelosladas.ICE.E_Shop.Models.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, UUID> {
    Optional<ShoppingCart> findByOwner_UserUuid(UUID uuid);

}
