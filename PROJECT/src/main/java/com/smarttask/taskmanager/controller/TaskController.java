package com.smarttask.taskmanager.controller;

import com.smarttask.taskmanager.dto.TaskStats;
import com.smarttask.taskmanager.entity.Task;
import com.smarttask.taskmanager.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin("*")
@Tag(name = "Tasks", description = "Task management APIs")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<Task> getTasks(Authentication authentication) {
        boolean isAdminOrManager = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MANAGER"));

        if (isAdminOrManager) {
            return service.getAllTasks();
        } else {
            return service.getTasksForUser(authentication.getName());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<TaskStats> getStats(Authentication authentication) {
        boolean isAdminOrManager = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN") || role.equals("ROLE_MANAGER"));

        if (isAdminOrManager) {
            return ResponseEntity.ok(service.getGlobalStats());
        } else {
            return ResponseEntity.ok(service.getUserStats(authentication.getName()));
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public Task addTask(@RequestBody Task task) {
        return service.saveTask(task);
    }

    @PutMapping("/{id}/status")
    public Task updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return service.updateTaskStatus(id, request.get("status"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}