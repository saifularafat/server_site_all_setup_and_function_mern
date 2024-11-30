const slugify = require('slugify');
const Product = require('../models/productsModel');
const { deletedImage } = require('../Helper/deletedImage');

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

const getProducts = async (page = 1, limit = 5) => {
    const products = await Product.find({})
        .populate('category')
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    if (!products) {
        throw createError(404, 'Product Not Found')
    }
    const count = await Product.find({}).countDocuments();

    return {
        products,
        count,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
    }
}

const getSingleProduct = async (slug) => {
    const product = await Product
        .findOne({ slug })
        .populate('category')
        .lean();
    if (!product) {
        throw createError(404, 'Product not found')
    }
    return product;
}

const updateProductBySlug = async (slug, image, updates, updateOptions) => {
    if (updates.name) {
        updates.slug = slugify(updates.name)
    }
    if (image) {
        if (image.size > 1024 * 1024 * 2) {
            throw createError(400, "Image file is too large. It must be less than 2 MB.")
        }
        updates.image = image.buffer.toString('base64')
    }
    const updatedProduct = await Product.findOneAndUpdate(
        { slug },
        updates,
        updateOptions,
    )
    if (!updatedProduct) {
        throw createError(404, "Product with this Name dons not exist.")
    }
    return updatedProduct;
}

const deleteProductBySlug = async (slug) => {
    const product = await Product.findOneAndDelete({ slug });
    if (!product) {
        throw createError(404, 'No product found.')
    }
    if (product && product.image) {
        await deletedImage(product.image)
    }
    return product;
}

module.exports = {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProductBySlug,
    deleteProductBySlug
}