package com.aggelosladas.ICE.E_Shop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCartItemDTO {
    private String username;
    private int productCode;
    private int quantity;
}
