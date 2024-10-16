const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultUserImagesPath } = require("../secret");


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "user name is required"],
        trim: true,
        minlength: [3, "The length of user name can be minimum 3 character"],
        maxlength: [31, "The length of user name can be maximum 31 character"],
    },
    email: {
        type: String,
        required: [true, "user email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: (v) => {
                return /^\w+([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2, 3})+$/.test(v);
                // return /^\w+([\.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2, 3})$/ + $ / test(v)
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "user Password is required"],
        minlength: [8, "The length of user Password can be minimum 8 character"],
        Set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        type: String,
        default: defaultUserImagesPath
    },
    address: {
        type: String,
        required: [true, "user Address is required"],
    },
    // nidBirth: {
    //     type: String,
    //     required: [true, "user Address is required"],
    // },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isInstructor: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const User = model("Users", userSchema)

module.exports = { User }