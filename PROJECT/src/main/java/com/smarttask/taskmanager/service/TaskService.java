package com.smarttask.taskmanager.service;

import com.smarttask.taskmanager.dto.TaskStats;
import com.smarttask.taskmanager.entity.Task;
import com.smarttask.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    public List<Task> getAllTasks() {
        List<Task> tasks = repository.findAllSortedByPriorityAndDate();
        return checkAndMarkOverdue(tasks);
    }

    public List<Task> getTasksForUser(String username) {
        List<Task> tasks = repository.findByAssigneeUsernameSorted(username);
        return checkAndMarkOverdue(tasks);
    }

    private List<Task> checkAndMarkOverdue(List<Task> tasks) {
        LocalDate today = LocalDate.now();
        boolean updatedAny = false;

        for (Task task : tasks) {
            if (task.getDueDate() != null 
                && task.getDueDate().isBefore(today) 
                && !"Completed".equalsIgnoreCase(task.getStatus())
                && !"Overdue".equalsIgnoreCase(task.getStatus())) {
                
                task.setStatus("Overdue");
                repository.save(task);
                updatedAny = true;
            }
        }
        // If we updated DB records, just re-fetch to ensure clean sorted state, though modifying in place is fine here for return
        return tasks;
    }

    public Task saveTask(Task task) {
        if (task.getStatus() == null || task.getStatus().isEmpty()) {
            task.setStatus("Pending");
        }
        return repository.save(task);
    }

    public Task updateTaskStatus(Long id, String status) {
        Task task = repository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        return repository.save(task);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }

    public TaskStats getGlobalStats() {
        return new TaskStats(
            repository.countByStatus("Pending"),
            repository.countByStatus("In Progress"),
            repository.countByStatus("Completed"),
            repository.countByStatus("Overdue"),
            repository.count()
        );
    }

    public TaskStats getUserStats(String username) {
        return new TaskStats(
            repository.countByAssigneeUsernameAndStatus(username, "Pending"),
            repository.countByAssigneeUsernameAndStatus(username, "In Progress"),
            repository.countByAssigneeUsernameAndStatus(username, "Completed"),
            repository.countByAssigneeUsernameAndStatus(username, "Overdue"),
            repository.findByAssigneeUsernameSorted(username).size()
        );
    }
}