const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskcard");
//const jwtVerify = require("../middleware/authMiddleware");
const verifyToken = require("../middleware/authMiddleware");

router.post("/create" ,verifyToken,taskController.createTask);
router.delete("/deleteTask/:taskId", taskController.deleteTask);
router.put("/editTask/:taskId", verifyToken,taskController.editTask);
router.get("/thisWeekTask", verifyToken,taskController.thisWeekTask);
router.get("/todayTask", verifyToken,taskController.todayTask);
router.get("/thisMonthTask", verifyToken,taskController.thisMonthTask);
router.put("/updateToBacklog/:taskId", verifyToken,taskController.updateToBacklog);
router.put("/updateToTodo/:taskId", verifyToken,taskController.updateToTodo);
router.put("/updateToInProgress/:taskId", verifyToken,taskController.updateToInProgress);
router.put("/updateToDone/:taskId", verifyToken,taskController.updateToDone);
module.exports = router;