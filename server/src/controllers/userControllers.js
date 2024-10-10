const createError = require("http-errors");
const { User } = require("../models/userModel");
const { serverPort } = require("../secret");


const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limitPage = Number(req.query.limit) || 1;

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

        // search don't mach this search Vealo than error throw
        if (!users) throw createError(404, "user not found !");

        res
            .status(200)
            .send({
                message: `E-commerce server site is running by http://localhost:${serverPort}`,
                users,
                pagination: {
                    totalPage: Math.ceil(count / limitPage),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limitPage) ? page + 1 : null,
                }
            })
    } catch (error) {
        next(error)
    }
}

module.exports = { getUsers };