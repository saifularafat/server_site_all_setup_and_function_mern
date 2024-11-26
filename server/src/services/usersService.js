const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const User = require("../models/userModel");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jwtResetPasswordKey, clientUrl } = require("../secret");
const emailWithNodeMailer = require("../Helper/email");

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
    handelUserAction,
    updateUserPasswordById,
    forgetPasswordByEmail,
    resetPassword,
}