const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const fs = require("fs");
require("dotenv").config();

const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 4 requests per `window` (here, per 15 minutes)
    message: "Too many requests created from this IP, please try again after 3 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose
    .connect(process.env.DBLINK)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(express.json());
app.use(limiter);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
app.use(sanitize({ replaceWith: "_" }));

if (!fs.existsSync("/images")) {
    fs.mkdir(path.join(__dirname, "images"), (err) => {
        if (err) {
            return console.error(err);
        }

        console.log("Directory created successfully!");
    });
}

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
