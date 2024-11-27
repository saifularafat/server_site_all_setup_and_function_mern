const slugify = require('slugify')
const { successResponse } = require("../Helper/responseController");
const Category = require('../models/categoryModel');
const { createCategory, getCategories, getCategory } = require('../services/categoryService');

const handelCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        await createCategory(name)

        return successResponse(res, {
            statusCode: 200,
            message: `Create was new Category`,
        })
    } catch (error) {
        next(error)
    }
}

const handelGetCategories = async (req, res, next) => {
    try {
        const allCategories = await getCategories();
        return successResponse(res, {
            statusCode: 200,
            message: `All Category fetched successfully.`,
            payload: allCategories,
        })
    } catch (error) {
        next(error)
    }
}

const handelGetCategory = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const allCategories = await getCategory(slug);
        return successResponse(res, {
            statusCode: 200,
            message: `All Category fetched successfully.`,
            payload: allCategories,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handelCreateCategory,
    handelGetCategories,
    handelGetCategory,
}