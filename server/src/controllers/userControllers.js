const createError = require("http-errors");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const { findWithId } = require("../services/findItems");
const { deletedImage } = require("../Helper/deletedImage");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jsonActivationKey, clientUrl } = require("../secret");
const emailWithNodeMailer = require("../Helper/email");
const { handelUserAction } = require("../services/usersService");

// ! all users 
const getUsers = async (req, res, next) => {
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

        // Total page get in an all users start
        const count = await User.find(filter).countDocuments();
        // Total page get in an all users END

        // search don't mach this search Value than error throw
        if (!users) { throw createError(404, "user not found !") };

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
const getUserById = async (req, res, next) => {
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
const deleteUserByID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);

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
const processRegister = async (req, res, next) => {
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

        const userExists = await User.exists({ email: email });

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
        try {
            // * unComment now
            // await emailWithNodeMailer(emailData)
        } catch (emailError) {
            next(createError(500, " Failed to send verification Email"))
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for competing your registration process`,
            payload: token,
        })
    } catch (error) {
        next(error)
    }
}

// ! user active by Account
const activateUsersAccount = async (req, res, next) => {
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

            const userNew = await User.create(decoded);
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
const updateUserByID = async (req, res, next) => {
    try {
        const updateId = req.params.id;
        const options = { password: 0 };
        await findWithId(User, updateId, options);
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {}
        // name, email, password, image, phone, address
        for (let key in req.body) {
            if (['name', 'password', 'phone', 'address'].includes(key)) {
                updates[key] = req.body[key];
            }
            else if (['email'].includes(key)) {
                throw new Error("Email can not be updated.")
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
            payload: updates
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

        const user = await findWithId(User, userId);

        // compare the password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) {
            throw createError(401, 'old password is not correct')
        }

        // Hash the new password
        const updatePassword = await bcrypt.hash(newPassword, 10);

        // update options
        const filter = { _id: userId };
        const updates = { $set: { password: updatePassword } };
        const updateOptions = { new: true };

        const updatedUser = await User.findByIdAndUpdate(
            filter,
            updates,
            updateOptions
        ).select('-password');
        if (!updatedUser) {
            throw createError(404, "User with this ID dons not exist.")
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Your password is update successfully",
            payload: { updatedUser }
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    getUsers,
    getUserById,
    deleteUserByID,
    updateUserByID,
    processRegister,
    activateUsersAccount,
    handelManageUserBanAndUnBanById,
    handelUpdatePassword,
};