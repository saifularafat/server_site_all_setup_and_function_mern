const createError = require("http-errors");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jsonAccessKey } = require("../secret");
const { access } = require("fs");


const handleLogin = async (req, res, next) => {
    // console.log("jdncio uznoivsdjps TOP", req.body);
    try {
        // email, password get the req.body
        const { email, password } = req.body;
        // user email is Exist
        // console.log("jdncio uznoivsdjps", email);

        const user = await User.findOne({ email });
        if (!user) {
            throw createError(
                404,
                " User does not exist with this Email. Please Register first"
            )
        }
        // compare to password
        // console.log("object-=----->", user.password);
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

        // token, cookie

        // create jwt token
        const accessToken = createJsonWebToken(
            { email },
            jsonAccessKey,
            "3h");
        // set up local stor token in the HTTP cookie
        res.cookie("access_token", accessToken, {
            maxAge: 180 * 60 * 1000, // 3 house
            httpOnly: true,
            // secure: true,
            sameSite: 'none'
        })
        // success responsive
        return successResponse(res, {
            statusCode: 200,
            message: "user logged in successfully",
            payload: {user}
        })
    } catch (error) {
        next(error)
    }
}
module.exports = { handleLogin }