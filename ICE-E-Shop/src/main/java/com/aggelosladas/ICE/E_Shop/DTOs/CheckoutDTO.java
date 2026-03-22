package com.aggelosladas.ICE.E_Shop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutDTO {
    private String username;
    private List<CheckoutItemDTO> items;
}
