const mongoose = require("mongoose");

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
      type: mongoose.Schema.Types.ObjectId,
      required:false,
      ref: "Task",
    },
  });

  module.exports = mongoose.model("Subtasks", SubTaskSchema);