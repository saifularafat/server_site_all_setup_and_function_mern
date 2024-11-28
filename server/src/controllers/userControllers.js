const createError = require("http-errors");
const jwt = require("jsonwebtoken")

const User = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const { findWithId } = require("../services/findItems");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jsonActivationKey, clientUrl } = require("../secret");
const { handelUserAction, updateUserPasswordById, forgetPasswordByEmail, resetPassword } = require("../services/usersService");
const checkUserExists = require("../Helper/checkUserExists");
const sendEmail = require("../Helper/sendEmail");

// ! all users 
const handelGetUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limitPage = Number(req.query.limit) || 5;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");

        const filter = {
            isAdmin: { $ne: true },
            isInstructor: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ]
        }
        // don't show all users password
        const options = { password: 0 }
        const users = await User
            .find(filter, options)
            .limit(limitPage)
            .skip((page - 1) * limitPage);

        // Total page get in an all users 
        const count = await User.find(filter).countDocuments();

        // search don't mach this search Value than error throw
        if (!users || users.length === 0) { throw createError(404, "user not found !") };

        return successResponse(res, {
            statusCode: 200,
            message: "users were returned successfully",
            payload: {
                users,
                pagination: {
                    totalPage: Math.ceil(count / limitPage),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limitPage) ? page + 1 : null,
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

// ! single user information by ID
const handelGetUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);
        return successResponse(res, {
            statusCode: 200,
            message: "user were returned successfully",
            payload: { user }
        })
    } catch (error) {
        next(error)
    }
}

// ! user delete by ID
const handelDeleteUserByID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        await findWithId(User, id, options);

        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        })

        return successResponse(res, {
            statusCode: 200,
            message: "user was deleted successfully",
        })
    } catch (error) {
        next(error)
    }
}

// ! user register process by user
const handelProcessRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const image = req.file;
        // check the image filed 
        if (!image) {
            throw createError(400, "Image file is required!")
        }
        // check the image size 
        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, "Image file is too large. It must be less than 2 MB.")
        }

        const imageBufferString = image.buffer.toString('base64');

        const userExists = await checkUserExists(email)

        if (userExists) {
            throw createError(409, "user email already exists. Please Sign in!")
        }

        // create jwt token
        const token = createJsonWebToken(
            { name, email, password, phone, address, image: imageBufferString },
            jsonActivationKey,
            "3h")

        // prepare email
        const emailData = {
            email,
            subject: "Account Activation Email",
            html: `
            <h2>Hello ${name} !</h2>
            <p>Please Click Here to <a href="${clientUrl}/api/users/activate/${token}"
                target="_blank"> Active Your Account</a>
             </p>
            `
        }

        // send email with nodemailer
        await sendEmail(emailData);

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for competing your registration process`,
        })
    } catch (error) {
        next(error)
    }
}

// ! user activate by Account
const handelActivateUsersAccount = async (req, res, next) => {
    try {
        const token = req.body.token;

        if (!token) throw createError(404, 'Token not found!')

        try {
            const decoded = jwt.verify(token, jsonActivationKey)

            if (!decoded) throw createError(401, 'unable to verify user!')

            const userExists = await User.exists({ email: decoded?.email });
            if (userExists) {
                throw createError(409, "user email already exists. Please Sign in!")
            }

            await User.create(decoded);

            return successResponse(res, {
                statusCode: 201,
                message: "user was registered successfully ",
            })
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw createError(401, "Token is Expired")
            } else if (error.name === "JsonWebTokenError") {
                throw createError(401, "Invalid Token")
            } else {
                throw error
            }
        }

    } catch (error) {
        next(error)
    }
}

// ! user update by ID
const handelUpdateUserByID = async (req, res, next) => {
    try {
        const updateId = req.params.id;
        const options = { password: 0 };
        await findWithId(User, updateId, options);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {}
        // name, email, password, image, phone, address
        const allowedFields = ['name', 'password', 'phone', 'address']
        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
            else if (key === 'email') {
                throw createError(400, "Email can not be updated.")
            }
        }
        // image update verify
        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                throw createError(400, "Image file is too large. It must be less than 2 MB.")
            }
            updates.image = image.buffer.toString('base64')
        }

        const updatedUser = await User.findByIdAndUpdate(updateId, updates, updateOptions)
            .select('-password');
        if (!updatedUser) {
            throw createError(404, "User with this ID dons not exist.")
        }

        return successResponse(res, {
            statusCode: 200,
            message: "user was update successfully",
            payload: updatedUser,
        })
    } catch (error) {
        next(error)
    }
}

// ? user Ban and unBan by ID wait Admin
const handelManageUserBanAndUnBanById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const action = req.body.action;

        await handelUserAction(userId, action)

        return successResponse(res, {
            statusCode: 200,
            message: `user was ${action} successfully`,
        })
    } catch (error) {
        next(error)
    }
}

// ! user update Password by ID
const handelUpdatePassword = async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword, confirmedPassword } = req.body;
        const userId = req.params.id;

        const updatedUser = await updateUserPasswordById(
            userId,
            email,
            oldPassword,
            newPassword,
            confirmedPassword
        );

        return successResponse(res, {
            statusCode: 200,
            message: "Your password is update successfully",
            payload: { updatedUser }
        })
    } catch (error) {
        next(error)
    }
}

// ! user Forget Password by ID
const handelForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const token = await forgetPasswordByEmail(email)

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for resting in the password`,
            payload: token,
        })
    } catch (error) {
        next(error)
    }
}

// ! user Reset Password by ID
const handelResetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        await resetPassword(token, newPassword)

        return successResponse(res, {
            statusCode: 200,
            message: "Password reset successfully",
            // payload: {}
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    handelGetUsers,
    handelGetUserById,
    handelDeleteUserByID,
    handelUpdateUserByID,
    handelProcessRegister,
    handelActivateUsersAccount,
    handelManageUserBanAndUnBanById,
    handelUpdatePassword,
    handelForgetPassword,
    handelResetPassword,
};