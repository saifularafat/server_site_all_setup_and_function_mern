const createError = require("http-errors");
const { User } = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const mongoose = require("mongoose");


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

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = { password: 0 };
        const user = await User.findById(id, options)

        if (!user) { throw createError(404, "user does not exist whit this id") };

        return successResponse(res, {
            statusCode: 200,
            message: "user were returned successfully",
            payload: { user }
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(404, "Invalid user ID"));
            return;
        }
        next(error)
    }
}

module.exports = { getUsers, getUser };