package fb.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fb.dto.LoginRequest;
import fb.model.User;
import fb.service.JwtService;
import fb.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // allow React frontend
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // ✅ Register (UPDATED)
    @PostMapping("/register")
    public Map<String, String> registerUser(@RequestBody User user) {

        String result = userService.registerUser(user);

        Map<String, String> response = new HashMap<>();

        if (result.equals("Email already exists")) {
            response.put("message", "Email already exists");
        } else {
            response.put("message", "Registration successful");
        }

        return response;
    }

    // ✅ Login → returns JWT token plus profile metadata
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody LoginRequest request) {

        String token = userService.loginUser(request.getEmail(), request.getPassword());

        if (token.equals("Invalid credentials")) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        User loggedUser = userService.getUserByEmail(request.getEmail());
        Integer roleValue = loggedUser.getRole();
        String roleText = (roleValue != null && roleValue == 1) ? "admin" : "student";

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", loggedUser.getId());
        response.put("email", loggedUser.getEmail());
        response.put("fullName", loggedUser.getName());
        response.put("department", loggedUser.getDepartment());
        response.put("role", roleText);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Missing or invalid Authorization header"));
        }

        String token = authorizationHeader.substring(7);
        String email;
        try {
            email = jwtService.extractEmail(token);
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid token"));
        }

        User user = userService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        Integer roleValue = user.getRole();
        String roleText = (roleValue != null && roleValue == 1) ? "admin" : "student";
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getName());
        response.put("department", user.getDepartment());
        response.put("role", roleText);
        return ResponseEntity.ok(response);
    }

    // ✅ Get all users (safe projection)
    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return userService.getAllUsers().stream().map(user -> {
            Integer roleValue = user.getRole();
            String roleText = (roleValue != null && roleValue == 1) ? "admin" : "student";
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("email", user.getEmail());
            response.put("fullName", user.getName());
            response.put("department", user.getDepartment());
            response.put("role", roleText);
            return response;
        }).collect(Collectors.toList());
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Integer roleValue = user.getRole();
        String roleText = (roleValue != null && roleValue == 1) ? "admin" : "student";
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getName());
        response.put("department", user.getDepartment());
        response.put("role", roleText);
        return ResponseEntity.ok(response);
    }

    // ✅ Update user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // ✅ Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
}