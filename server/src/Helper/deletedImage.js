const { defaultUserImagesPath } = require("../secret");

const fs = require("fs").promises;

const deletedImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath)
        await fs.unlink(userImagePath)
            .console.log("User image was deleted")
    } catch (error) {
        console.error("user image does not exist")

    }
};

module.exports = { deletedImage }