const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jsonAccessKey } = require("../secret");

const isLoggedIn = async (req, res, next) => {
    console.log(res);
    try {
        const token = req.cookies.access_token;
        if (!token) {
            throw createError(401, 'Access token not found..!')
        }
        const decoded = jwt.verify(token, jsonAccessKey)
        if (!decoded) {
            throw createError(401, 'Invalid access token. Please login Again.!')
        }
        res.userId == decoded._id;

        console.log('=======decodeddddddd', decoded);
        // console.log('=======isLoggedIn', token);
    } catch (error) {
        return next(error)
    }
}
module.exports = { isLoggedIn }