const { body } = require("express-validator");
const createError = require("http-errors");

// product validator 
const validatorProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage("Product Name is required")
        .isLength({ min: 3, max: 150 })
        .withMessage("Product Name should be at least 3-150 characters long!"),
    body('description')
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ min: 3 })
        .withMessage("Description should be at least 3 characters long!"),
    body('price')
        .trim()
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body('quantity')
        .trim()
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 0 })
        .withMessage("Quantity must be a positive integer"),
    body('category')
        .trim()
        .notEmpty()
        .withMessage("Category is required"),
    body('image')
        .custom((value, { req }) => {
            if (!req.file || !req.file.buffer) {
                throw new Error("Product image is required!")
            }
            return true;
        })
        .withMessage("Product image is required"),
]

// update Product Validator
const validatorUpdateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Product Name should be at least 3 characters long!"),
    body('description')
        .trim()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Product description should be at least 3 characters long!"),
    body('price')
        .trim()
        .notEmpty()
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body('quantity')
        .trim()
        .notEmpty()
        .isInt({ min: 0 })
        .withMessage("Quantity must be a positive integer"),
    body('category')
        .trim()
        .notEmpty(),
    body('image')
        .custom((value, { req }) => {
            if (!req.file || !req.file.buffer) {
                throw new Error("Product image is required!")
            }
            return true;
        })
]

module.exports = {
    validatorProduct,
    validatorUpdateProduct,
}