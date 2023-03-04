require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const reviewSchema = new mongoose.Schema(
  {
    id: Number,
    product_id: Number,
    rating: Number,
    date: String,
    summary: String,
    body: String,
    recommend: Boolean,
    reported: Boolean,
    reviewer_name: String,
    reviewer_email: String,
    response: String,
    helpfulness: Number
  }
);

const

const Review = new mongoose.model('Review', reviewSchema);

module.exports = Review;