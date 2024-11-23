const express = require("express");
const authRouter = express.Router();
const runValidation = require("../validators");


const {
    handleLogin,
    handleLogout
} = require("../controllers/authController");
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth");
const { validatorUserLogin } = require("../validators/auth");

authRouter.post(
    "/login",
    validatorUserLogin,
    runValidation,
    isLoggedOut,
    handleLogin)

authRouter.post(
    "/logout",
    isLoggedIn,
    handleLogout)

module.exports = authRouter; 