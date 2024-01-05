const fs = require("fs");

const Book = require("../models/Book");

module.exports.createBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book);

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
            // averageRating: 0,
            // ratings: [],
        });

        await book.save();

        res.status(201).json({ message: "Book successfuly created! " });
    } catch (err) {
        res.status(400).json({ err });
    }
};

module.exports.getAllBooks = async (req, res) => {
    try {
        await Book.find();

        res.status(200).json(books);
    } catch (err) {
        res.status(404).json({ err });
    }
};

module.exports.getBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ err });
    }
};

module.exports.bestRating = async (req, res) => {
    try {
        const books = await Book.find();

        books.sort((a, b) => {
            return a.averageRating - b.averageRating;
        });

        books = books.reverse();
        books = books.slice(0, 3);

        res.status(200).json(books);
    } catch (err) {
        res.status(404).json({ err });
    }
};

module.exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });

        if (!book) res.status(404).json({ message: "No book found." });

        fs.unlinkSync(book.imageUrl.replace(`${req.protocol}://${req.get("host")}`, "."));

        await Book.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Book as been deleted." });
    } catch (err) {
        res.status(404).json({ err });
    }
};

module.exports.rateBook = async (req, res) => {
    try {
        if (req.body.grade > 5 || req.body.grade < 0) return res.status(400).json({ message: "Invalid rate number." });

        const book = await Book.findOne({ _id: req.params.id });

        let ratings = book.ratings;

        for (let rate of ratings) {
            if (req.auth == rate.userId) return res.status(400).json({ message: "User already rate this book." });
        }

        ratings.push({
            userId: req.auth.userId,
            grade: req.body.rating,
        });

        let averageRating = 0;

        for (let rating of ratings) {
            averageRating += parseInt(rating.grade);
            console.log(rating.grade);
        }

        averageRating /= ratings.length;
        averageRating = averageRating.toFixed();

        book.averageRating = averageRating;

        await Book.updateOne({ _id: req.params.id }, { ratings, averageRating });

        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ err });
    }
};

module.exports.updateBook = async (req, res) => {
    try {
        const bookObject = req.file
            ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` }
            : { ...req.body };

        const book = await Book.findOne({ _id: req.params.id });

        if (!book) res.status(404).json({ message: "No book found." });
        if (book.userId != req.auth.userId) res.status(401).json({ message: "You don't have permission." });

        if (req.file) {
            fs.unlinkSync(book.imageUrl.replace(`${req.protocol}://${req.get("host")}`, "."));
        }

        await Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id });

        res.status(200).json({ message: "Book updated." });
    } catch (err) {
        res.status(400).json({ err });
    }
};
