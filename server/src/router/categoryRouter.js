const express = require("express");
const categoryRouter = express.Router();

const runValidation = require("../validators");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

const {
    handelCreateCategory,
    handelGetCategories,
    handelGetCategory,
    handelUpdateCategory,
    handelDeleteCategory,
} = require("../controllers/categoryController");
const { validatorCategory } = require("../validators/category");

// ? Category POST, GET, DELETE, single 
//  * POST Category
categoryRouter.post("/create",
    validatorCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelCreateCategory
);

//  ~ GET Category
categoryRouter.get("/",
    handelGetCategories
);
//  ^ single Category
categoryRouter.get("/:slug",
    handelGetCategory
);
//  & update Category
categoryRouter.put("/:slug",
    validatorCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelUpdateCategory
);
//  * Delete Category
categoryRouter.delete("/:slug",
    isLoggedIn,
    isAdmin,
    handelDeleteCategory
);

module.exports = categoryRouter;