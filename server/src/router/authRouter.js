const express = require("express");
const authRouter = express.Router();
const runValidation = require("../validators");


const {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handelProtectedRoute
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

authRouter.get(
    "/refresh-token",
    handleRefreshToken)

authRouter.get(
    "/protected",
    handelProtectedRoute)

module.exports = authRouter; 