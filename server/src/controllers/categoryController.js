const createError = require('http-errors')
const slugify = require('slugify')
const { successResponse } = require("../Helper/responseController");
const Category = require('../models/categoryModel');
const { createCategory, getCategories, getCategory, updateCategory } = require('../services/categoryService');

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

        if (!allCategories) {
            throw createError(404, 'Category Not Found')
        }
        return successResponse(res, {
            statusCode: 201,
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

const handelUpdateCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { slug } = req.params;

        const updatedCategory = await updateCategory(name, slug)

        if (!updatedCategory) {
            throw createError(404, 'No Category found with this slug.')
        }
        return successResponse(res, {
            statusCode: 200,
            message: `Category updated successfully.`,
            payload: updatedCategory,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handelCreateCategory,
    handelGetCategories,
    handelGetCategory,
    handelUpdateCategory,
}