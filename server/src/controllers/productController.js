const createError = require("http-errors");
const slugify = require("slugify")

const { successResponse } = require("../Helper/responseController");
const { findWithId } = require("../services/findItems");
const Product = require("../models/productsModel");


const handelCreateProduct = async () => {
    try {
        const { name, description, price, quantity, shipping, category } = req.body;
        const image = req.file;
        // check the image filed 
        if (!image) {
            throw createError(400, "Image file is required!")
        }
        // check the image size 
        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, "Image file is too large. It must be less than 2 MB.")
        }

        const imageBufferString = image.buffer.toString('base64');

        const productExists = await Product.exists({ name: name })

        if (productExists) {
            throw createError(409, "Product with this name already exist.")
        }

        // create Product
        const product = await Product.create({
            name: name,
            slug: slugify(name),
            description: description,
            price: price,
            quantity: quantity,
            shipping: shipping,
            image: imageBufferString,
            category: category,
        })

        return successResponse(res, {
            statusCode: 200,
            message: `product was create successfully`,
            payload: { product }
        })
    } catch (error) {
        next(error)
    }
}
module.exports = { handelCreateProduct }