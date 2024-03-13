const express = require("express");
const router = express.Router();
const { model } = require("mongoose");
const Task = require("../model/task");
const jwt = require("jsonwebtoken");


const analytics = async (req, res ,next) => {
  try {
    //const token = req.cookies.token;
    
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const priorityHighData = await Task.find({
      refUserId: userId,
      priority: "heigh",
    });
    const priorityMidumData = await Task.find({
      refUserId: userId,
      priority: "medium",
    });
    const priorityLowData = await Task.find({
      refUserId: userId,
      priority: "low",
    });

    const dueDates = await Task.find({
      refUserId: userId,
      dueDate: { $ne: null },
    });

    const backlogTasksData = await Task.find({
      refUserId: userId,
      status: { $eq: "backlog" },
    });

    const toDoTasksData = await Task.find({
      refUserId: userId,
      status: { $eq: "todo" },
    });

    const inProgressTasksData = await Task.find({
      refUserId: userId,
      status: { $eq: "inprogress" },
    });

    const doneTasksData = await Task.find({
      refUserId: userId,
      status: { $eq: "done" },
    });

    const totalCountBacklog = backlogTasksData.length;
    const totalCountToDo = toDoTasksData.length;
    const totalCountInProgress = inProgressTasksData.length;
    const totalCountDone = doneTasksData.length;
    const totalCountHigh = priorityHighData.length;
    const totalCountMedium = priorityMidumData.length;
    const totalCountLow = priorityLowData.length;
    const totalDueDate = dueDates.length;

    res
      .status(200)
      .json({
        sucess: true,
        backlogData: totalCountBacklog,
        toDoData: totalCountToDo,
        inProgressData: totalCountInProgress,
        doneData: totalCountDone,
        priorityHighData: totalCountHigh,
        priorityMidumData: totalCountMedium,
        priorityLowData: totalCountLow,
        dueDates: totalDueDate,
      });
      
  } catch (error) {
    console.log(error);
    res.status(500).json({ sucess: false, message: error });
  }
};

module.exports = { analytics };
