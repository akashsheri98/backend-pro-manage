const express = require("express");
const router = express.Router();
const taskController = require("../controller/taskcard");
const jwtVerify = require("../middleware/authMiddleware");

router.post("/create" ,jwtVerify,taskController.createTask);
router.delete("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;