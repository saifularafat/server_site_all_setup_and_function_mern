const fs = require("fs").promises;

const deletedImage = async (userImagePath) => {
    try {
        await fs.access(userImagePath)
        await fs.unlink(userImagePath)
            .console.log("image was deleted")
    } catch (error) {
        console.error("image does not exist")

    }
};

module.exports = { deletedImage }