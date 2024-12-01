const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jwtResetPasswordKey, clientUrl } = require("../secret");
const emailWithNodeMailer = require("../Helper/email");

// find all users
const findUsers = async (search, limit, page) => {
    try {
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
            .limit(limit)
            .skip((page - 1) * limit);

        // Total page get in an all users 
        const count = await User.find(filter).countDocuments();

        // search don't mach this search Value than error throw
        if (!users || users.length === 0) { throw createError(404, "user not found !") };

        return {
            users,
            pagination: {
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
            },
        };
    } catch (error) {
        throw error;
    }
}

//find single user by id
const findUserById = async (id, options = {}) => {
    try {
        const user = await User.findById(id, options);
        if (!user) throw createError(404, "user not found");
        return user;
    } catch (error) {
        throw error;
    }
}

//delete user by id
const deleteUserById = async (id, options = {}) => {
    try {
        const user = await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        })

        if (!user) throw createError(404, "user not found");
    } catch (error) {
        throw error;
    }
}

//update user by id
const updateUserById = async (userId, req) => {
    try {
        const options = { password: 0 };
        await findUserById(userId, options);

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

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions,
        ).select('-password');
        if (!updatedUser) {
            throw createError(404, "User with this ID dons not exist.")
        }
        return updatedUser;
    } catch (error) {
        throw error;
    }
}

// user Ban and UnBan service handel
const handelUserAction = async (userId, action) => {
    try {
        let update;

        if (action === 'ban') {
            update = { isBanned: true };
        } else if (action === 'unBan') {
            update = { isBanned: false };
        } else {
            throw createError(400, 'Invalid action, Please select Ban and Unban option.')
        }
        const updateOptions = { new: true, runValidators: true, context: 'query' };

        const updatedUser = await User.findByIdAndUpdate(userId, update, updateOptions)
            .select('-password');
        if (!updatedUser) {
            throw createError(400, `User was not ${action} successfully.`)
        }
    } catch (error) {
        throw (error);
    }
}

// user password update service handel
const updateUserPasswordById = async (userId, email, oldPassword, newPassword, confirmedPassword) => {
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw createError(400, 'User is not found this Email')
        }

        // Check if new password and confirmed password match
        if (newPassword !== confirmedPassword) {
            throw createError(400, 'New password and confirmed password did not match');
        }

        // compare the password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordMatch) {
            throw createError(401, 'old password is incorrect')
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
        return updatedUser;
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id')
        }
        throw (error);
    }
}

// user forget Password By email service handel
const forgetPasswordByEmail = async (email) => {
    try {
        const userData = await User.findOne({ email: email });
        if (!userData) {
            throw createError(
                404,
                'Email is incorrect or you have not verified your Email address. Please register First'
            )
        }

        // create jwt token
        const token = createJsonWebToken(
            { email },
            jwtResetPasswordKey,
            "10m")

        // prepare email
        const emailData = {
            email,
            subject: "Forget Your Password",
            html: `
    <h2>Hello ${userData.name} !</h2>
    <p>Please Click Here to <a href="${clientUrl}/api/users/forget-password/${token}"
        target="_blank"> Forget your password</a>
     </p>
    `
        }

        // send email with nodemailer
        emailWithNodeMailer(emailData)
        return token;

    } catch (error) {
        throw (error);
    }
}

// user reset Password By email service handel
const resetPassword = async (token, newPassword) => {
    try {
        // verify jwt token
        const decoded = jwt.verify(token, jwtResetPasswordKey);
        if (!decoded) {
            throw createError(400, 'Invalid or expired token.')
        }

        // Hash the new password
        const updatePassword = await bcrypt.hash(newPassword, 10);

        // update options
        const filter = { email: decoded.email };
        const updates = { password: updatePassword };
        const updateOptions = { new: true };

        const updatedUser = await User.findOneAndUpdate(
            filter,
            updates,
            updateOptions
        ).select('-password');

        if (!updatedUser) {
            throw createError(400, "Password reset failed.")
        }

    } catch (error) {
        throw (error);
    }
}

module.exports = {
    findUsers,
    findUserById,
    deleteUserById,
    updateUserById,
    handelUserAction,
    updateUserPasswordById,
    forgetPasswordByEmail,
    resetPassword,
}