package com.smarttask.taskmanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.smarttask.taskmanager.entity.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t ORDER BY " +
           "CASE t.priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 ELSE 4 END ASC, " +
           "t.dueDate ASC")
    List<Task> findAllSortedByPriorityAndDate();

    @Query("SELECT t FROM Task t WHERE t.assigneeUsername = :username ORDER BY " +
           "CASE t.priority WHEN 'High' THEN 1 WHEN 'Medium' THEN 2 WHEN 'Low' THEN 3 ELSE 4 END ASC, " +
           "t.dueDate ASC")
    List<Task> findByAssigneeUsernameSorted(@Param("username") String username);

    long countByStatus(String status);
    
    long countByAssigneeUsernameAndStatus(String username, String status);

}