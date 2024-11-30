const express = require("express");
const seedRouter = express.Router();
const { seedUser, seedProducts } = require('../controllers/seedController');
const { userImageUpload, productImageUpload } = require("../middlewares/uploadFile");

seedRouter.get("/users", userImageUpload.single("image"), seedUser)

seedRouter.get("/products", productImageUpload.single("image"), seedProducts)

module.exports = seedRouter;