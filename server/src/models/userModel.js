const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

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
            validator: function (v) {
                return /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(v);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        required: [true, "User password is required"],
        minlength: [8, "The length of user password must be at least 8 characters"],
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }
    },
    image: {
        type: Buffer,
        contentType: String,
        required: [true, "User Image is required"],
    },
    phone: {
        type: String,
        required: [true, "user phone is required"],
    },
    address: {
        type: String,
        required: [true, "user Address is required"],
        minlength: [3, "The length of user Address can be minimum 3 character"],
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



// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    // Check if the password is modified (for example, during update)
    if (!this.isModified("password")) return next();

    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = model("Users", userSchema)

module.exports = User;