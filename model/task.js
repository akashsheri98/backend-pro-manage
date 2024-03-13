const mongoose = require("mongoose");

// Define Checklist Item Schema
const SubTaskSchema = new mongoose.Schema({
  item: {
    type: String,
    default: "Add your task",
  },
  checked: {
    type: Boolean,
    default: false,
  },
  refTaskId: {
    type: mongoose.Types.ObjectId,
    
    required:false,
  },
  refcardId: {
    type: mongoose.Types.ObjectId,
    ref:"Task",
    required:false,
  },
});

// Define Task Schema
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "heigh"],
    default: "low",
    required: true,
  },

  subtasks: {
    type: [SubTaskSchema],
    required: true,
  },

  dueDate: {
    type: Date,

  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  refUserId: {
    type: mongoose.Types.ObjectId,  // reference to the user who posted this job
    required:false,
  },
  status: {
    type: String,
    enum: ["backlog", "todo", "inprogress", "done"],
    default: "todo",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
