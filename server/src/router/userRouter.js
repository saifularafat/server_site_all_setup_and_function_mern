const express = require("express");
const userRouter = express.Router();
const { getUsers } = require("../controllers/userControllers");


userRouter.get("/", getUsers);

module.exports = userRouter;