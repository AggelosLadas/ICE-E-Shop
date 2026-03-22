package com.aggelosladas.ICE.E_Shop.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.VarcharJdbcType;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @JdbcType(VarcharJdbcType.class)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID productUuid;

    private String productName;
    private String productDescription;
    private Double productPrice;
    private String productImage;
    private int productQuantity=0;

    @Column(unique = true)
    private int productCode;

    @PrePersist
    public void generateProductCode(){
        if (this.productCode == 0) {
            // Generates a random number between 100000 and 999999
            this.productCode = (int) (Math.random() * 900000) + 100000;
        }
    }

    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "product")
    private List<CartItem> cartItems;



}
