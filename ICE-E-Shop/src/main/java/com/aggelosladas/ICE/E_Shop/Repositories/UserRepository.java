package com.aggelosladas.ICE.E_Shop.Repositories;

import com.aggelosladas.ICE.E_Shop.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndPassword(String username, String password); //unsafe but i will delete it if i ever implement security
    Optional<User> findByEmailAndPassword(String email, String password);

}
