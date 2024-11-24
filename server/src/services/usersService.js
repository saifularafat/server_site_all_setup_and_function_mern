const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const User = require("../models/userModel");

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

module.exports = { handelUserAction };



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
        return updatedUser;
    } catch (error) {
        throw (error);
    }
}

module.exports = { handelUserAction, updateUserPasswordById }