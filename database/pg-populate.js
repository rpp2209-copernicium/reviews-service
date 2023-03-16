require("dotenv").config();
const path = require('path');
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'fig',
  host: 'localhost',
  database: 'reviews',
  password: '',
  port: 5432
});

//CONNECT TO DB
pool.connect();

//POPULATE DB
var photosPath = path.resolve(__dirname, '../../csv-data/reviews_photos.csv');
console.log(photosPath);
var reviewsPath = path.resolve(__dirname, '../../csv-data/reviews.csv');
pool.query(`COPY reviews_photos FROM '${photosPath}' DELIMITER ',' CSV HEADER;`), (err, res) => {
  if (err) {
    console.log('error copying reviews_photos:', err);
    pool.end();
  } else {
    console.log('reviews_photos copied:', res);
    pool.end();
  }
};