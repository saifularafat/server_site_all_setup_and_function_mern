const createError = require("http-errors");
const jwt = require("jsonwebtoken")

const { User } = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const { findWithId } = require("../services/findItems");
const { deletedImage } = require("../Helper/deletedImage");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jsonActivationKey, clientUrl } = require("../secret");
const emailWithNodeMailer = require("../Helper/email");


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


const deleteUserByID = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await findWithId(User, id, options);

        const userImagePath = user.image;

        deletedImage(userImagePath);

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

const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        // console.log("EMAIL SENDING  ====> LINE - 1218 ", req.body.email);

        const userExists = await User.exists({ email: email });

        if (userExists) {
            throw createError(409, "user email already exists. Please Sign in!")
        }

        // create jwt token
        const token = createJsonWebToken(
            { name, email, password, phone, address }, jsonActivationKey, "3h")

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
            await emailWithNodeMailer(emailData)
        } catch (emailError) {
            next(createError(500, " Failed to send verification Email"))
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please go to your ${email} for competing your registration process`,
            payload: { token }
        })
    } catch (error) {
        next(error)
    }
}

const activateUsersAccount = async (req, res, next) => {
    try {
        const token = req.body.token;

        console.log("Tooooooken 155 => ", token);

        if (!token) throw createError(404, 'Token not found!')

        try {
            const decoded = jwt.verify(token, jsonActivationKey)

            console.log("decoded os data ====> 158", decoded);

            if (!decoded) throw createError(401, 'unable to verify user!')

            await User.create(decoded);
            
            const userExists = await User.exists({ email: decoded?.email });
            if (userExists) {
                throw createError(409, "user email already exists. Please Sign in!")
            }

            const userNew = await User.create(decoded);
            console.log("New Users ===>", userNew);
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

module.exports = {
    getUsers,
    getUserById,
    deleteUserByID,
    processRegister,
    activateUsersAccount
};