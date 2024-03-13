const express = require("express");
const router = express.Router();
const { model } = require("mongoose");
const Task = require("../model/task");
const jwt = require("jsonwebtoken");

const jwtVerify = require("../middleware/authMiddleware");

const createTask = async (req, res, next) => {
  try {
    const { title, priority, subtasks, dueDate, status } = req.body;

    if (!title || !priority || !subtasks) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const task = new Task({
      title,
      priority,
      subtasks,
      dueDate,
      status,
      refUserId: req.body.userId,
    });

    await task.save();

    return res
      .status(201)
      .json({ message: "task created successful", data: task });
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
      return res.status(404).json({ message: "Task not found" });
    }

    // Respond with a success message
    res.json({ message: "Task deleted successfully", data: deletedTask });
  } catch (error) {
    // If an error occurs during the deletion process, respond with 500 Internal Server Error
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editTask = async (req, res) => {
  try {
    const { title, priority, subtasks, dueDate, status } = req.body;
    const taskId = req.params.taskId;

    if (!title || !priority || !subtasks) {
      return res.status(400).json({ message: "Bad Request" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      {
        $set: {
          title,
          priority,
          subtasks,
          dueDate,
          status,
        },
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const thisWeekTask = async (req, res) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const currentDate = new Date(); // Get the current date

    const firstDayOfWeek = new Date(currentDate); // Get the first day of the current week (Sunday)
    firstDayOfWeek.setHours(
      0,
      0,
      0,
      0 - firstDayOfWeek.getDay() * 24 * 60 * 60 * 1000
    );

    const lastDayOfWeek = new Date(currentDate); // Get the last day of the current week (Saturday)
    lastDayOfWeek.setHours(
      0,
      0,
      0,
      0 + (6 - lastDayOfWeek.getDay()) * 24 * 60 * 60 * 1000
    );
    if (!userId) {
      return res.status(400).json({ message: "Bad Request" });
    }
    // Query tasks created within the current week
    const tasks = await Task.find({
      refUserId: userId,
      createDate: {
        $gte: firstDayOfWeek,
        $lte: lastDayOfWeek,
      },
    });

    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const todayTask = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const tasks = await Task.find({ refUserId: userId });

    const today = new Date(); // Get today's date

    // Filter tasks to include only those created today
    const tasksCreatedToday = tasks.filter((task) => {
      const taskDate = new Date(task.createDate);
      return taskDate.toDateString() === today.toDateString(); // Compare date parts only
    });

    res.json({ data: tasksCreatedToday }); // Send the tasks created today as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const thisMonthTask = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
      return res.status(400).json({ message: "Bad Request" });
    }
    const tasks = await Task.find({ refUserId: userId });

    const today = new Date();

    // Convert the date to a string
    const dateString = today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
    // Split the string by month and year
    const [month, year] = dateString.split(" ");

    // Filter tasks to include only those created this month
    const tasksCreatedThisMonth = tasks.filter((task) => {
      const taskDate = new Date(task.createDate);
      const taskMonth = taskDate.toLocaleDateString("en-US", {
        month: "long",
      });
      const taskYear = taskDate.toLocaleDateString("en-US", {
        year: "numeric",
      });
      return taskMonth === month && taskYear === year;
    });

    res.json({ data: tasksCreatedThisMonth });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


/*status edit*/

const updateToBacklog = async (req, res) => {
  try {
    
    const taskId = req.params.taskId;

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      { status: "backlog" },  
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated backlog successfully", data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateToTodo = async (req, res) => {
  try {
    
    const taskId = req.params.taskId;

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      { status: "todo" },  
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated todo successfully", data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateToInProgress = async (req, res) => {
  try {
    
    const taskId = req.params.taskId;

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      { status: "inprogress" },  
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated inprogress successfully", data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateToDone= async (req, res) => {
  try {
    
    const taskId = req.params.taskId;

    const updatedTask = await Task.findByIdAndUpdate(
      { _id: taskId },
      { status: "done" },  
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated done successfully", data: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTask,
  deleteTask,
  editTask,
  thisWeekTask,
  todayTask,
  thisMonthTask,
  updateToBacklog,
  updateToTodo,
  updateToInProgress,
  updateToDone
};
