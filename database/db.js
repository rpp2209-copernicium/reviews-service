require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

const recipeSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    ingredients: Array,
    steps: Array,
    favorite: Boolean,
    views: Number,
    image_id: String
  },
  { timestamps: true } // will automatically create and set `createdAt` and `updatedAt` timestamps
);

const Recipe = new mongoose.model('Recipe', recipeSchema); //  TODO: Fill in arguments!

module.exports = Recipe;