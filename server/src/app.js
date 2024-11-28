const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const { serverPort } = require("./secret");
const userRouter = require("./router/userRouter");
const authRouter = require("./router/authRouter");
const seedRouter = require("./router/seedRouter");
const { errorResponse } = require("./Helper/responseController");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");

const app = express();

// API request rate limiter
const rateLimitApi = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20, // Max 10 requests per IP
    message: "Too many requests from this IP. Please try again later.",
});

// Limit body size
const bodyParserOptions = {
    limit: "100kb",
};

app.use(cookieParser());
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json(bodyParserOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimitApi);

// Middleware to check for large headers
app.use((req, res, next) => {
    const maxHeaderSize = 100 * 1024; //100 KB in bytes
    const headersSize = JSON.stringify(req.headers).length;

    console.log(`Headers size: ${headersSize} bytes`); 

    if (headersSize > maxHeaderSize) {
        return res.status(431).json({
            status: "error",
            message: `Request Header Fields Too Large. Current size: ${headersSize} bytes. Limit: ${maxHeaderSize} bytes.`,
        });
    }
    next();
});

// Router API
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/seed", seedRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

// Middleware for authentication
const isLoggedIn = (req, res, next) => {
    const login = true; // Dummy authentication check
    if (login) {
        req.body.id = 101; // Add user ID to the request body
        next();
    } else {
        return res.status(401).json("Please login first, then try again.");
    }
};

// Root route
app.get("/", (req, res) => {
    res
        .status(200)
        .send(`E-commerce server site is running at http://localhost:${serverPort}`);
});

// Client-side error handling
app.use((req, res, next) => {
    next(createError(404, "Route not found."));
});

// Server-side error handling
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status || 500,
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
