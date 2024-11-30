const express = require("express");
const productRouter = express.Router();

const { productImageUpload } = require("../middlewares/uploadFile")

const { validatorProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const { handelCreateProduct } = require("../controllers/productController");

// !Get, Post, Put, Delete all user router
productRouter.post("/product-create",
    productImageUpload.single("image"),
    validatorProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelCreateProduct
);

module.exports = productRouter; 