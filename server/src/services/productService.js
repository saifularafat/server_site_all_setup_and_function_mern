const slugify = require('slugify');
const Product = require('../models/productsModel');

const createProduct = async (productData) => {
    const {
        name,
        description,
        price,
        quantity,
        shipping,
        category,
        image } = productData;

    const productExists = await Product.exists({ name: name })

    if (productExists) {
        throw createError(409, "Product with this name already exist.")
    }

    // create Product
    const newProduct = await Product.create({
        name: name,
        slug: slugify(name),
        description: description,
        price: price,
        quantity: quantity,
        shipping: shipping,
        image: image,
        category: category,
    })

    return newProduct;
}
module.exports = {
    createProduct,
}