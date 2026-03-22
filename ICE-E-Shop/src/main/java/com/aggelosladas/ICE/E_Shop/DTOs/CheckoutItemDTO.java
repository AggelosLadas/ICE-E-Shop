package com.aggelosladas.ICE.E_Shop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CheckoutItemDTO {
    private int productCode;
    private int quantity;
}
