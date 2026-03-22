package com.aggelosladas.ICE.E_Shop.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.VarcharJdbcType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {
    @Id
    @JdbcType(VarcharJdbcType.class)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID shoppingCartUuid;

    @OneToOne
    @JsonIgnore
    @ToString.Exclude
    @JoinColumn(name="user_id")
    private User owner;

    @OneToMany(mappedBy="shoppingCart",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> cartItems = new ArrayList<>();

}
