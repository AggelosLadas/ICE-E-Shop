package com.aggelosladas.ICE.E_Shop.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddProductDTO {
    private String productName;
    private String productDescription;
    private Double productPrice;
    private String productImage;
    private int productQuantity=0;

}
