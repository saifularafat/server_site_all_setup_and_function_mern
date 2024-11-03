const express = require("express");
const authRouter = express.Router();
const runValidation = require("../validators");


const {
    handleLogin,
    handleLogout
} = require("../controllers/authController");

authRouter.post("/login", handleLogin)
authRouter.post("/logout", handleLogout)

module.exports = authRouter; 