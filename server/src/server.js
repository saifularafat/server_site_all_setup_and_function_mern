const app = require("./app");
const connectDataBse = require("./config/db");
const logger = require("./controllers/loggerController");
const { serverPort } = require('./secret');


// someone hit this website first of all come =>>>>>
// -> server.js then 
//  -> app.js 
// -> userRouter.js 
// -> controllers folder and working is start
app.listen(serverPort, async () => {
    logger.log('info', `server is run by ${serverPort} E-Commerce Mern stack Project is running by http://localhost:${serverPort}`);
    await connectDataBse()
})