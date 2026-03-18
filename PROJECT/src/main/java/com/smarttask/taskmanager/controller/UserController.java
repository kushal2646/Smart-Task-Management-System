package com.smarttask.taskmanager.controller;

import org.springframework.web.bind.annotation.*;
import com.smarttask.taskmanager.entity.User;
import com.smarttask.taskmanager.repository.UserRepository;
import java.util.List;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management APIs")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}