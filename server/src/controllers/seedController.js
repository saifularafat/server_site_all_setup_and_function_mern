const data = require("../data")
const Product = require("../models/productsModel")
const User = require("../models/userModel")

const seedUser = async (req, res, next) => {
    try {
        // deleting all existing users data
        await User.deleteMany({})

        // insertIn new user is existing
        const users = await User.insertMany(data.users)

        // success message
        return res.status(201).json(users)
    } catch (error) {
        next(error)
    }
}

const seedProducts = async (req, res, next) => {
    try {
        // deleting all existing products data
        await Product.deleteMany({})

        // insertIn new products is existing
        const products = await Product.insertMany(data.products)

        // success message
        return res.status(201).json(products)
    } catch (error) {
        next(error)
    }
}

module.exports = { seedUser, seedProducts };