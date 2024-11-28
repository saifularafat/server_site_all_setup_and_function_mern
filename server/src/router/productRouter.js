const express = require("express");
const productRouter = express.Router();

const productImageUpload = require("../middlewares/uploadFile");

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const { handelCreateProduct } = require("../controllers/productController");

// !Get, Post, Put, Delete all user router
productRouter.post("/product-create",
    productImageUpload.single("image"),
    handelCreateProduct
);

module.exports = productRouter; 