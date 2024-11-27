const express = require("express");
const categoryRouter = express.Router();

const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const { handelCreateCategory } = require("../controllers/categoryController");
const { validatorCategory } = require("../validators/category");

categoryRouter.post("/create",
    validatorCategory,
    runValidation,
    isLoggedIn,
    isAdmin,
    handelCreateCategory
);

module.exports = categoryRouter; 