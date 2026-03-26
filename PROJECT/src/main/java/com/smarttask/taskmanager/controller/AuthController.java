package com.smarttask.taskmanager.controller;

import com.smarttask.taskmanager.entity.User;
import com.smarttask.taskmanager.repository.UserRepository;
import com.smarttask.taskmanager.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Auth management APIs")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          UserDetailsService userDetailsService,
                          JwtUtil jwtUtil,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        // default to USER if omitted
        String role = request.getOrDefault("role", "ROLE_USER");

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    @Operation(summary = "Login user")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody Map<String, String> authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.get("username"), authRequest.get("password"))
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.get("username"));
        
        // Fetch user from DB to get actual role
        User user = userRepository.findByUsername(userDetails.getUsername()).get();
        
        final String jwt = jwtUtil.generateToken(userDetails, user.getRole());

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", user.getRole());
        response.put("username", user.getUsername());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/test-token")
    @Operation(summary = "Test JWT token validation")
    public ResponseEntity<?> testToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> result = new HashMap<>();
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            result.put("error", "No Bearer token in Authorization header");
            result.put("authHeader", authHeader);
            return ResponseEntity.ok(result);
        }
        String token = authHeader.substring(7);
        result.put("tokenLength", token.length());
        try {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);
            Boolean expired = jwtUtil.isTokenExpired(token);
            result.put("username", username);
            result.put("role", role);
            result.put("expired", expired);
            result.put("valid", true);
        } catch (Exception e) {
            result.put("valid", false);
            result.put("error", e.getClass().getSimpleName() + ": " + e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
