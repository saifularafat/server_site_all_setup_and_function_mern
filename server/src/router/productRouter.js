const express = require("express");
const productRouter = express.Router();

const { productImageUpload } = require("../middlewares/uploadFile")

const { validatorProduct, validatorUpdateProduct } = require("../validators/product");
const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const {
    handelCreateProduct,
    handelGetProducts,
    handelGetSingleProduct,
    handelUpdateProduct,
    handelDeleteProduct,
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
//  & update Category
productRouter.put("/:slug",
    productImageUpload.single("image"),
    // validatorUpdateProduct,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelUpdateProduct
);
//  * Delete Category
productRouter.delete("/:slug",
    isLoggedIn,
    isAdmin,
    handelDeleteProduct
);

module.exports = productRouter; 