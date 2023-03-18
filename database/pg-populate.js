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
var reviewsPath = path.resolve(__dirname, '../../csv-data/reviews.csv');
var characteristicsPath = path.resolve(__dirname, '../../csv-data/characteristics.csv');
var characteristicReviewPath = path.resolve(__dirname, '../../csv-data/characteristic_review.csv');
pool.query(`COPY reviews_photos FROM '${photosPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
  if (err) {
    console.log('error copying reviews_photos');
  } else {
    console.log('reviews_photos copied');
    pool.query(`COPY reviews FROM '${reviewsPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
      if (err) {
        console.log('error copying reviews');
        pool.end();
      } else {
        console.log('reviews copied');
        pool.query(`COPY characteristics FROM '${characteristicsPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
          if (err) {
            console.log('error copying characteristics');
            pool.end();
          } else {
            console.log('characteristics copied');
            pool.query(`COPY characteristic_review FROM '${characteristicReviewPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
              if (err) {
                console.log('error copying characteristic_reviews');
                pool.end();
              } else {
                console.log('characteristic_reviews copied');
                pool.end();
              }
            });
          }
        });
      }
    });
  }
});