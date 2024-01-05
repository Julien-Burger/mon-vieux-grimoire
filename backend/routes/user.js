const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");

const userCtrl = require("../controllers/user");

const loginValidator = [
    body("email").isEmail().withMessage("Enter a valid email."),
    body("password").isLength({ min: 8 }).withMessage("Password need at least 8 characters."),
];

const limiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 4 requests per `window` (here, per 15 minutes)
    message: "Too many accounts created from this IP, please try again after 3 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post("/signup", loginValidator, userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

module.exports = router;
