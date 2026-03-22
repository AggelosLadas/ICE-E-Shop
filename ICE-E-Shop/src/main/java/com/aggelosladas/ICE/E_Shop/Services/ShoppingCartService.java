package com.aggelosladas.ICE.E_Shop.Services;

import com.aggelosladas.ICE.E_Shop.Repositories.ShoppingCartRepository;
import com.aggelosladas.ICE.E_Shop.Repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ShoppingCartService {

    private final  ShoppingCartRepository shoppingCartRepository;

    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository) {
        this.shoppingCartRepository = shoppingCartRepository;
    }


}
