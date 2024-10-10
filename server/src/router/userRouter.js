const express = require("express");
const userRouter = express.Router();
const {
    getUsers,
    deleteUserByID,
    getUserById,
    processRegister,
} = require("../controllers/userControllers");

// Get all user router
userRouter.post("/process-register", processRegister);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserByID);

module.exports = userRouter; 