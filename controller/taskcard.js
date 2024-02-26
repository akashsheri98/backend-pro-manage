const express = require("express");
const router = express.Router();
const { model } = require("mongoose");
const Task = require("../model/task");
const jwtVerify = require("../middleware/authMiddleware");

const createTask = async (req, res, next) => {
  try {
    const { title, priority, subtasks, dueDate, refUserId } = req.body;

    if (!title || !priority || !subtasks || !dueDate) {
      return res.status(400).json({ errorMessage: "Bad Request" });
    }

    const task = new Task({
      title,
      priority,
      subtasks,
      dueDate,
      refUserId: req.body.userId,
    });

    await task.save();

    return res.status(201).json({ Message: "task created successful" });
  } catch (error) {
    next(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  
  try {
    const taskId = req.params.taskId;
    // Find the task by ID and delete it
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      // If no task is found with the provided ID, respond with 404 Not Found
      return res.status(404).json({ error: "Task not found" });
    }

    // Respond with a success message
    res.json({ message: "Task deleted successfully", data: deletedTask });
  } catch (error) {
    // If an error occurs during the deletion process, respond with 500 Internal Server Error
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createTask, deleteTask };
