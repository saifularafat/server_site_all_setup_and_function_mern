const express = require("express");
const userRouter = express.Router();
const {
    getUsers,
    deleteUserByID,
    getUserById,
    processRegister,
    activateUsersAccount,
} = require("../controllers/userControllers");
const upload = require("../middlewares/uploadFile");
const { validatorUserRegistration } = require("../validators/auth");
const runValidation = require("../validators");

// Get all user router
userRouter.post("/process-register",
    upload.single("image"),
    validatorUserRegistration,
    runValidation,
    processRegister);

userRouter.post("/verify", activateUsersAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserByID);

module.exports = userRouter; 