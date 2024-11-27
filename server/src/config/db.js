const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDataBse = async (option = {}) => {
    try {
        await mongoose.connect(mongodbURL, option)
        logger.log('info', "connection in the mongoose DB E-commerce-MERN successfully connection now!");

        mongoose.connection.on("error", (error) => {
            logger.log('error', "DB connection error:", error);
        })
    } catch (error) {
        logger.log('error', "Could not connect DB catch error:", error.toString);
    }
}

module.exports = connectDataBse