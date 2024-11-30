const multer = require("multer");

const {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
} = require("../config");

const userImageStorage = multer.memoryStorage();
const productImageStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false)
    }

    if (file.size > MAX_FILE_SIZE) {
        return cb(new Error('File size exceeds the maximum limit'), false)
    }

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('File type is not allowed'), false)
    }
    cb(null, true)
}
const userImageUpload = multer({
    storage: userImageStorage,
    fileFilter: fileFilter
})


const productFileFilter = (req, file, cb) => {

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false)
    }

    if (file.size > MAX_FILE_SIZE) {
        return cb(new Error('File size exceeds the maximum limit'), false)
    }

    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('File type is not allowed'), false)
    }
    cb(null, true)
}
const productImageUpload = multer({
    storage: productImageStorage,
    fileFilter: productFileFilter
})


// const productStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, UPLOAD_PRODUCT_IMAGE_DIRECTORY)
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '_' + file.originalname)
//     }
// })
module.exports = { userImageUpload, productImageUpload };