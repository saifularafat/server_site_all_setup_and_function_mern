const express = require("express");
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const xssClean = require('xss-clean')
const rateLimit = require('express-rate-limit');
const { serverPort } = require("./secret");
const  userRouter  = require("./router/userRouter");
const  seedRouter  = require("./router/seedRouter");



// api het by limit show data
const rateLimitApi = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10,
    message: "To many requests from this IP. please try agin later"
})

app.use(xssClean())
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(rateLimitApi);

app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);


// middleware 
const isLoggedIn = (req, res, next) => {
    const login = true
    if (login) {
        req.body.id = 101
        next()
    } else {
        return res.status(401).json(" Please login first Then try agin")
    }
}


app.get("/", (req, res) => {
    res.
        status(200).
        send(`E-commerce server site is running by http://localhost:${serverPort}`)
})



// client site error handle
app.use((req, res, next) => {
    next(createError(404, "router not found.!"));
})
// server site error handle => all error handle the function
app.use((err, req, res, next) => {
    console.error(err.stack)
    return res.status(err.status || 500).json({
        success: false,
        message: err.message,
    })
})
module.exports = app;