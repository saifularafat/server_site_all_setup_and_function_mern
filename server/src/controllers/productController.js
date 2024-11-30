const createError = require("http-errors");
const slugify = require("slugify")

const { successResponse } = require("../Helper/responseController");
const { findWithId } = require("../services/findItems");
const Product = require("../models/productsModel");
const { createProduct, getProducts, getSingleProduct, deleteProductBySlug, updateProductBySlug } = require("../services/productService");


const handelCreateProduct = async (req, res, next) => {
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

        const productData = {
            name,
            description,
            price,
            quantity,
            shipping,
            category,
            image: imageBufferString,
        }
        const product = await createProduct(productData);

        return successResponse(res, {
            statusCode: 200,
            message: `product was create successfully`,
            payload: product,
        })
    } catch (error) {
        next(error)
    }
}

const handelGetProducts = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const searchRegExp = new RegExp(".*" + search + ".*", "i");

        const filter = {
            $or: [
                { name: { $regex: searchRegExp } },
                // { price: { $regex: searchRegExp } },
            ]
        }

        const productData = await getProducts(page, limit, filter)

        return successResponse(res, {
            statusCode: 201,
            message: `Return all the product successfully.`,
            payload: {
                products: productData.products,
                pagination: {
                    totalPage: productData.totalPage,
                    currentPage: productData.currentPage,
                    previousPage: page - 1,
                    nextPage: page + 1,
                    totalNumberOfProduct: productData.count
                }
            },
        })
    } catch (error) {
        next(error)
    }
}

const handelGetSingleProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const product = await getSingleProduct(slug);
        return successResponse(res, {
            statusCode: 200,
            message: `Return a product is successfully.`,
            payload: product,
        })
    } catch (error) {
        next(error)
    }
}

const handelUpdateProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const updateOptions = { new: true, runValidators: true, context: 'query' };
        let updates = {}
        // name, description, price, image, quantity, category, sold, shipping
        const allowedFields = [
            'name',
            'description',
            'price',
            'quantity',
            'sold',
            'shipping',
            'category',
        ]
        for (const key in req.body) {
            if (allowedFields.includes(key)) {
                if (key === 'name') {
                    updates.slug = slugify(req.body[key]);
                }
                updates[key] = req.body[key];
            }
        }
        // image update verify
        const image = req.file;
        const updateProduct = await updateProductBySlug(
            slug,
            image,
            updates,
            updateOptions,
        )

        return successResponse(res, {
            statusCode: 200,
            message: "product was update successfully",
            payload: updateProduct,
        })
    } catch (error) {
        next(error)
    }
}

const handelDeleteProduct = async (req, res, next) => {
    try {
        const { slug } = req.params;
        await deleteProductBySlug(slug)
        return successResponse(res, {
            statusCode: 200,
            message: `Product was deleted successfully.`,
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handelCreateProduct,
    handelGetProducts,
    handelGetSingleProduct,
    handelUpdateProduct,
    handelDeleteProduct
}