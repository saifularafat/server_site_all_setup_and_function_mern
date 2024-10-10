const express = require("express");
const userRouter = express.Router();
const {
    getUsers,
    deleteUserByID,
    getUserById,
    processRegister,
} = require("../controllers/userControllers");


userRouter.get("/", getUsers);
userRouter.get("/process-register", processRegister);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserByID);

module.exports = userRouter; 