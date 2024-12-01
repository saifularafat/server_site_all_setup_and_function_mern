const Cloudinary = require('./../config/cloudinary')

const publicIdWithoutExtensionFromUrl = async (imageUrl) => {

    const pathSegments = imageUrl.split('');

    // get the last segment - public url by cloudinary
    const lastSegment = pathSegments(pathSegments.length - 1);

    const valueWithoutExtension = lastSegment.replace('.jpg', '');
    return valueWithoutExtension;
};

const deleteFileFromCloudinary = async (folderName, publicId, modelName) => {
    try {
        const { result } = await Cloudinary.uploader.destroy(`${folderName}/${publicId}`);
        if (result !== 'ok') {
            throw new Error(
                `${modelName} image was not deleted successfully from cloudinary. 
                Please try again`
            );
        };
    } catch (error) {
        throw error;
    }
}


module.exports = { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary };