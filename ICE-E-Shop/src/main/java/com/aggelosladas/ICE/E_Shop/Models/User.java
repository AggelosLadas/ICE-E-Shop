package com.aggelosladas.ICE.E_Shop.Models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcType;
import org.hibernate.type.descriptor.jdbc.VarcharJdbcType;

import java.sql.Types;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcType(VarcharJdbcType.class)
    private UUID userUuid;

    @Column(unique = true)
    private String username;
    @Column(unique = true)
    private String email;
    private String password;
    private String role = "USER";

    @OneToOne(mappedBy = "owner",cascade = CascadeType.ALL)
    private ShoppingCart shopping_cart;


}
