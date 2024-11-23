const express = require("express");
const seedRouter = express.Router();
const { seedUser } = require('../controllers/seedController');
const userImageUpload = require("../middlewares/uploadFile");

seedRouter.get("/users", userImageUpload.single("image"), seedUser)

module.exports = seedRouter;