const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDataBse = async (option = {}) => {
    try {
        await mongoose.connect(mongodbURL, option)
        console.log("connection in the mongoose DB E-commerce-MERN successfully connection now!");

        mongoose.connection.on("error", (error) => {
            console.error("DB connection error:", error);
        })
    } catch (error) {
        console.error("Could not connect DB catch error:", error.toString);
    }
}

module.exports = connectDataBse