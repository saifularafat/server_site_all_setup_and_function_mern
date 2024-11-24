const createError = require("http-errors");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jsonAccessKey } = require("../secret");
const { access } = require("fs");


const handleLogin = async (req, res, next) => {
    try {
        console.log("NEXT STEP running");
        const { email, password } = req.body;
        // user email is Exist
        const user = await User.findOne({ email });
        // console.log("jdncio uznoivsdjps controller", user);
        if (!user) {
            throw createError(
                404,
                " User does not exist with this Email. Please Register first"
            )
        }
        // compare to password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw createError(
                401,
                " Email/Password did not match"
            )
        }
        // isBanned
        if (user.isBanned) {
            throw createError(
                403,
                " You are Banned. Please contact Authority"
            )
        }

        // token, cookie without image
        const userInfo = {
            _id: user?._id,
            email: user?.email,
            name: user?.name,
            phone: user?.phone,
            address: user?.address,
            isAdmin: user?.isAdmin,
            isInstructor: user?.isInstructor,
            isBanned: user?.isBanned,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt,
        }

        // create jwt token
        const accessToken = createJsonWebToken(
            { user: userInfo },
            jsonAccessKey,
            "3h");
        // set up local stor token in the HTTP cookie
        res.cookie("access_token", accessToken, {
            maxAge: 180 * 60 * 1000, // 3 house
            httpOnly: true,
            sameSite: 'none'
        })

        const userWithoutPassword = await User.findOne({ email }).select('-password');
        // success responsive
        return successResponse(res, {
            statusCode: 200,
            message: "user logged in successfully",
            payload: { users: userWithoutPassword }
        })
    } catch (error) {
        next(error)
    }
}


const handleLogout = async (req, res, next) => {
    try {
        // success responsive
        res.clearCookie("access_token");
        return successResponse(res, {
            statusCode: 200,
            message: "user logout is successfully",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}
module.exports = { handleLogin, handleLogout }