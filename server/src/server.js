const app = require("./app");
const connectDataBse = require("./config/db");
const { serverPort } = require('./secret');


// someone hit this website first of all come =>>>>>
// -> server.js then 
//  -> app.js 
// -> userRouter.js 
// -> controllers folder and working is start
app.listen(serverPort,async () => {
    console.log(`server is run by ${serverPort} E-Commerce Mern stack Project is running by http://localhost:${serverPort}`);
    await connectDataBse()
})