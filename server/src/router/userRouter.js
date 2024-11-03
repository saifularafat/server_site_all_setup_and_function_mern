const express = require("express");
const userRouter = express.Router();
const {
    getUsers,
    deleteUserByID,
    getUserById,
    processRegister,
    activateUsersAccount,
    updateUserByID,
} = require("../controllers/userControllers");
const userImageUpload = require("../middlewares/uploadFile");
const { validatorUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");

// !Get, Post, Put, Delete all user router
userRouter.post("/process-register",
    userImageUpload.single("image"),
    validatorUserRegistration,
    runValidation,
    processRegister);

userRouter.post("/activate", activateUsersAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserByID);

userRouter.put("/:id",
    userImageUpload.single("image"),
    updateUserByID);

module.exports = userRouter; 