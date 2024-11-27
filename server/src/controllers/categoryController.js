const slugify = require('slugify')
const { successResponse } = require("../Helper/responseController");
const Category = require('../models/categoryModel');
const { createCategory } = require('../services/categoryService');

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

module.exports = { handelCreateCategory }