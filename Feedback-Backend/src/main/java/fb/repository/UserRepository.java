package fb.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fb.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query methods (optional)

    User findByEmail(String email);

    User findByEmailAndPassword(String email, String password);

}