const express = require("express");
const rateLimiter = require("express-rate-limit");
const authControllers = require("./../controllers/authControllers");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const router = express.Router();

router.route("/register").post(apiLimiter, authControllers.register);
router.route("/login").post(apiLimiter, authControllers.login);
router
  .route("/updateUser")
  .patch(authControllers.authenticated, authControllers.updateUser);

module.exports = router;
