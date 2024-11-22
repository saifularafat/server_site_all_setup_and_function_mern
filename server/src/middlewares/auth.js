const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jsonAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
        if (!accessToken) {
            throw createError(401, 'Access token not found.Please Log in..!')
        }
        const decoded = jwt.verify(accessToken, jsonAccessKey)
        if (!decoded) {
            throw createError(401, 'Invalid access token. Please login Again.!')
        }
        // console.log("object 0015 =======>", decoded.user);
        req.body.user == decoded?.user;
        next();
    } catch (error) {
        return next(error);
    }
}


const isLoggedOut = async (req, res, next) => {
    try {
        const accessToken = req.cookies.access_token;
        if (accessToken) {
            try {
                const decoded = jwt.verify(accessToken, jsonAccessKey)
                if (decoded) {
                    throw createError(400, 'User is already loggedIn..!');
                }
            } catch (error) {
                throw error;
            }
        }
        next();
    } catch (error) {
        return next(error);
    }
}


const isAdmin = async (req, res, next) => {
    try {
        console.log("object Is Admin Upcoming", req.user?.isAdmin);
        // if (!req.user.isAdmin) {
        //     throw createError(403, 'Forbidden. You must be an admin to access this resource.')
        // }
        next();
    } catch (error) {
        return next(error);
    }
}


module.exports = { isLoggedIn, isLoggedOut, isAdmin }