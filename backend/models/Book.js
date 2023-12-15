const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, requiredd: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String },
            grade: { type: Number },
        },
    ],
    averageRating: { type: Number, required: true },
});

module.exports = mongoose.model("Book", bookSchema);
