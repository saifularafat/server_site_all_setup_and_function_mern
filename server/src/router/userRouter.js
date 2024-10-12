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

// Get all user router
userRouter.post("/process-register", upload.single("image"), processRegister);
userRouter.post("/verify", activateUsersAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserByID);

module.exports = userRouter; 