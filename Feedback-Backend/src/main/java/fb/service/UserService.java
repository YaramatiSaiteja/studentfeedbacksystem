package fb.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fb.model.User;
import fb.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // ✅ Register user with email check
    public String registerUser(User user) {

        // 🔥 Check if email already exists
        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            return "Email already exists";
        }

        userRepository.save(user);
        return "User registered successfully";
    }

    // ✅ Login user → returns JWT token (WITH ROLE)
    public String loginUser(String email, String password) {

        User user = userRepository.findByEmail(email);

        // 🔥 Check both email and password
        if (user != null && user.getPassword().equals(password)) {
            return jwtService.generateToken(user.getEmail(), user.getRole());
        }

        return "Invalid credentials";
    }

    // ✅ Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // ✅ Delete user
    public String deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return "User deleted successfully";
        }
        return "User not found";
    }

    // ✅ Update user
    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id).orElse(null);

        if (user != null) {
            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());
            user.setRole(updatedUser.getRole());
            user.setDepartment(updatedUser.getDepartment());
            user.setPassword(updatedUser.getPassword());

            return userRepository.save(user);
        }

        return null;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}