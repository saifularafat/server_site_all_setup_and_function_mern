const express = require("express");
const productRouter = express.Router();

const { productImageUpload } = require("../middlewares/uploadFile")

const { validatorProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const {
    handelCreateProduct,
    handelGetProducts,
    handelGetSingleProduct,
} = require("../controllers/productController");

// !Get, Post, Put, Delete all user router
productRouter.post("/product-create",
    productImageUpload.single("image"),
    validatorProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelCreateProduct
);

//  ~ GET product
productRouter.get("/",
    handelGetProducts
);
//  ^ single product
productRouter.get("/:slug",
    handelGetSingleProduct
);

module.exports = productRouter; 