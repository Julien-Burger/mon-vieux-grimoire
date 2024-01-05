const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/User");

module.exports.signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() });
        }

        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            email: req.body.email,
            password: hashPassword,
        });

        await user.save();

        res.status(201).json({ message: "User created." });
    } catch (err) {
        res.status(500).json({ err });
    }
};

module.exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(401).json({ message: "Mail / password incorrect." });

        bcrypt.compare(req.body.password, user.password).then(valid => {
            if (valid)
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign({ userId: user._id }, process.env.TOKEN, { expiresIn: "24h" }),
                });
            else return res.status(401).json({ message: "Mail / password incorrect." });
        });
    } catch (err) {
        res.status(500).json({ err });
    }
};
