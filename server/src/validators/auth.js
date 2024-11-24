const { body } = require("express-validator");
const createError = require("http-errors");

// registration validator 
const validatorUserRegistration = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3, max: 31 })
        .withMessage("Name should be at least 3-31 characters long!"),
    body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required, Enter your Email")
        .isEmail()
        .withMessage("Invalid email address!"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required, Enter your password")
        .isLength({ min: 8 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .withMessage("Password should content at least one uppercase letter, one lowercase letter, one number, and one special characters.!"),
    body('address')
        .trim()
        .notEmpty()
        .withMessage("Address is required")
        .isLength({ min: 3 })
        .withMessage("Password should be at least 6 characters long!"),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage("Phone is required, Enter your Phone"),
    body('image')
        .custom((value, { req }) => {
            if (!req.file || !req.file.buffer) {
                throw new Error("User image is required!")
            }
            return true;
        })
        .withMessage("User image is required"),
]

// input validator 
const validatorUserLogin = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage("Email is required, Enter your Email")
        .isEmail()
        .withMessage("Invalid email address!"),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("Password is required, Enter your password")
]

// Update password
const validatorUserUpdatePassword = [
    body('oldPassword')
        .trim()
        .notEmpty()
        .withMessage("Password is required, Enter your password"),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage("Password is required, Enter your new password")
        .isLength({ min: 8 })
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        // .withMessage(
        //     "Password should content at least one uppercase letter, one lowercase letter, one number, and one special characters.!"
        // )
        ,
    body('confirmedPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw createError(400, 'New password and confirmed password did not match')
            }
            return true;
        }),

]

module.exports = {
    validatorUserRegistration,
    validatorUserLogin,
    validatorUserUpdatePassword
}