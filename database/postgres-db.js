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

// Hello World!
// pool.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message);
// });

// CREATE ALL TABLES


// pool.query(`CREATE TABLE IF NOT EXISTS reviews (
//   id integer,
//   product_id integer,
//   rating integer,
//   date varchar,
//   summary text,
//   body text,
//   recommend boolean,
//   reported boolean,
//   reviewer_name text,
//   reviewer_email text,
//   response text,
//   helpfulness integer )`, (err, res) => {
//   if (err) {
//     console.log('error creating reviews table:', err);
//   } else {
//     console.log('reviews table created');
//     pool.query(`CREATE TABLE IF NOT EXISTS characteristics (
//       id integer,
//       product_id integer,
//       name varchar)`, (err, res) => {
//       if (err) {
//         console.log('error creating characteristics table', err);
//       } else {
//         console.log('characteristics table created');
//         pool.query(`CREATE TABLE IF NOT EXISTS reviews_photos (
//           id integer,
//           product_id integer,
//           url varchar
//         )`, (err, res) => {
//           if (err) {
//             console.log('error creating reviews_photos table');
//           } else {
//             console.log('reviews_photos table created');
//             pool.query(`CREATE TABLE IF NOT EXISTS characteristic_review (
//               id integer,
//               characteristic_id integer,
//               review_id integer,
//               value integer
//             )`, (err, res) => {
//               if (err) {
//                 console.log('error creating characteristic_reviews table');
//               } else {
//                 console.log('characteristic_reviews table created');
//                 pool.end();
//               }
//             });
//           }
//         });
//       }
//     });
//   }
// });


//DROP TABLES
// pool.query('DROP TABLE reviews', (err, res) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('reviews table dropped:', res);
//     pool.end();
//   }
// });


//POPULATE DB
var photosPath = path.resolve(__dirname, '../../../csv-data/reviews_photos.csv');
var reviewsPath = path.resolve(__dirname, '../../../csv-data/reviews.csv');
pool.query(`COPY reviews_photos FROM '${photosPath}' DELIMITER ',' CSV HEADER;`), (err, res) => {
  if (err) {
    console.log('error copying reviews_photos:', err);
    pool.end();
  } else {
    console.log('reviews_photos copied:', res);
    pool.end();
  }
};