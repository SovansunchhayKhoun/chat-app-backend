const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const loginLimiter = require("../../middleware/loginLimiter");

router.route("/register").post(authController.handleRegistration)

router.route("/login").post(loginLimiter, authController.handleLogin);

router.route("/refresh").get(authController.handleRefreshToken);

router.route("/logout").post(authController.handleLogout);

router.route("/user").get(authController.getUser);


module.exports = router;
