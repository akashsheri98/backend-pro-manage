const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register" , authController.register);
router.post("/login" ,authController.login);
router.post("/logout" , authController.logout);
router.post("/resetPassword" , authController.resetPassword);

module.exports = router;