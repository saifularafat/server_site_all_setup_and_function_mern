const data = require("../data")
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

module.exports = { seedUser };