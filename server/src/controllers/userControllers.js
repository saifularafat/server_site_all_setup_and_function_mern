const createError = require("http-errors");
const { User } = require("../models/userModel");
const { serverPort } = require("../secret");




module.exports = { getUsers };