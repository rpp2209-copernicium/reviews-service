require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const reviewSchema = new mongoose.Schema(
  {
    review_id: Number,
    rating: Number,
    summary: String,
    recommend: Boolean,
    response: String,
    body: String,
    date: String,
    reviewer_name: String,
    helpfulness: Number,
    photos: Array
  }
);

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;