package com.smarttask.taskmanager.dto;

public class TaskStats {
    private long pending;
    private long inProgress;
    private long completed;
    private long overdue;
    private long total;

    public TaskStats() {}

    public TaskStats(long pending, long inProgress, long completed, long overdue, long total) {
        this.pending = pending;
        this.inProgress = inProgress;
        this.completed = completed;
        this.overdue = overdue;
        this.total = total;
    }

    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }
    public long getInProgress() { return inProgress; }
    public void setInProgress(long inProgress) { this.inProgress = inProgress; }
    public long getCompleted() { return completed; }
    public void setCompleted(long completed) { this.completed = completed; }
    public long getOverdue() { return overdue; }
    public void setOverdue(long overdue) { this.overdue = overdue; }
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
}