const express = require("express");
const userRouter = express.Router();
const { getUsers, getUser } = require("../controllers/userControllers");


userRouter.get("/", getUsers);
userRouter.get("/:id", getUser);

module.exports = userRouter; 