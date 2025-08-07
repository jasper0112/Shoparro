package com.shoparro.backend.repository;
import com.shoparro.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;



public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

}
