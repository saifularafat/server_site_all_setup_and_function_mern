const multer = require("multer");
const path = require("path");

const {
    UPLOAD_USER_IMAGE_DIR,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE,
} = require("../config");

const storage = multer.memoryStorage(
    
);

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
        // const error = createError(400, "File type not allowed")
        return cb(new Error("File type not allowed"), false)
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
})
module.exports = upload;