const createError = require("http-errors");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const { successResponse } = require("../Helper/responseController");
const { createJsonWebToken } = require("../Helper/jsonwebtoken");
const { jsonAccessKey, jsonRefreshKey } = require("../secret");
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../Helper/cookies");

const handleLogin = async (req, res, next) => {
    try {
        // console.log("NEXT STEP running");
        const { email, password } = req.body;
        // user email is Exist
        const user = await User.findOne({ email });
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
            "1h");
        // set up local cookie stor token in the HTTP cookie
        setAccessTokenCookie(res, accessToken)

        // create Refresh jwt token
        const refreshToken = createJsonWebToken(
            { user: userInfo },
            jsonRefreshKey,
            "7d");
        // set up local cookie refresh token in the HTTP cookie
        setRefreshTokenCookie(res, refreshToken)

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
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
        res.clearCookie("refresh_token");
        return successResponse(res, {
            statusCode: 200,
            message: "user logout is successfully",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}

const handleRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refresh_token;

        // old refresh token and jwtRefreshKey check the token 
        const decodedToken = jwt.verify(oldRefreshToken, jsonRefreshKey);
        if (!decodedToken) {
            throw createError(
                401,
                'Invalid refresh token. Please login again.'
            )
        }

        // again JWT token create 
        const accessToken = createJsonWebToken(
            decodedToken.user,
            jsonAccessKey,
            "1h");
        // set up local cookie stor token in the HTTP cookie
        setAccessTokenCookie(res, accessToken)

        return successResponse(res, {
            statusCode: 200,
            message: "New access token is generated",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}

const handelProtectedRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;

        // old refresh token and jwtRefreshKey check the token 
        const decodedToken = jwt.verify(accessToken, jsonAccessKey);
        if (!decodedToken) {
            throw createError(
                401,
                'Invalid Access token. Please login again.'
            )
        }

        return successResponse(res, {
            statusCode: 200,
            message: "Protected resources access successfully",
            payload: {}
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handelProtectedRoute,
}