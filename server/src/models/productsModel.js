const { Schema, model } = require("mongoose");

// name, slug, description, price, quantity, sold, shipping, image
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [
            3,
            "The length of  Product can be minimum 3 character"
        ],
        maxlength: [
            150,
            "The length of Product can be maximum 150 character"
        ],
    },
    slug: {
        type: String,
        required: [true, "Product Slug is required"],
        lowercase: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Product Description is required"],
        minlength: [
            7,
            "The length of  Product description can be minimum 7 character"
        ],
    },
    price: {
        type: Number,
        required: [true, "Product Price is required"],
        trim: true,
        validate: {
            validator: (v) => v > 0,
            message: (props) =>
                `${props.value} is not a valid price! Price must be greater than 0`,
        },
    },
    quantity: {
        type: Number,
        required: [true, "Product Quantity is required"],
        trim: true,
        validate: {
            validator: (v) => v > 0,
            message: (props) =>
                `${props.value} is not a valid Quantity! Quantity must be greater than 0`,
        },
    },
    sold: {
        type: Number,
        trim: true,
        default: 0,
        validate: {
            validator: (v) => v >= 0,
            message: (props) =>
                `${props.value} is not a Sold Quantity! Sold Quantity must be greater than 0`,
        },
    },
    shipping: {
        type: Number,
        default: 0 // shipping free then 0 or paid the somethings amount
    },
    image: {
        type: Buffer,
        contentType: String,
        required: [true, "Product Image is required"],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    }
}, { timestamps: true })


const Product = model("Product", productSchema)

module.exports = Product;