require('dotenv').config()

const serverPort = process.env.SERVER_PORT || 5002

const mongodbURL = `mongodb+srv://${process.env.DATA_USER}:${process.env.DATA_PASS}@cluster0.guqonkt.mongodb.net/ecommerce-mern`
    || "mongodb://localhost:27017/ecommerce-mern"

const defaultUserImagesPath = process.env.DEFAULT_USER_IMAGE || "public/images/users/userDefault.jpg"

module.exports = { serverPort, mongodbURL, defaultUserImagesPath }