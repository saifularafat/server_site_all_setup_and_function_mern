const createError = require('http-errors')
const emailWithNodeMailer = require("./email")

const sendEmail = async (emailData) => {
    try {
        // * unComment now
        // await emailWithNodeMailer(emailData)
    } catch (emailError) {
        throw createError(500, " Failed to send verification Email")
    }
}
module.exports = sendEmail;