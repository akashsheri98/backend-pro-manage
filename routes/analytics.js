// analyticsRoutes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controller/analytics");
const verifyToken = require("../middleware/authMiddleware");

router.get("/analytics",verifyToken,  analyticsController.analytics);

module.exports = router;
