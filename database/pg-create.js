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

pool.query(`CREATE TABLE IF NOT EXISTS reviews (
  id integer,
  product_id integer,
  rating integer,
  date varchar,
  summary text,
  body text,
  recommend boolean,
  reported boolean,
  reviewer_name text,
  reviewer_email text,
  response text,
  helpfulness integer )`, (err, res) => {
  if (err) {
    console.log('error creating reviews table:', err);
  } else {
    console.log('reviews table created');
    pool.query(`CREATE TABLE IF NOT EXISTS characteristics (
      id integer,
      product_id integer,
      name varchar)`, (err, res) => {
      if (err) {
        console.log('error creating characteristics table', err);
      } else {
        console.log('characteristics table created');
        pool.query(`CREATE TABLE IF NOT EXISTS reviews_photos (
          id integer,
          product_id integer,
          url varchar
        )`, (err, res) => {
          if (err) {
            console.log('error creating reviews_photos table');
          } else {
            console.log('reviews_photos table created');
            pool.query(`CREATE TABLE IF NOT EXISTS characteristic_review (
              id integer,
              characteristic_id integer,
              review_id integer,
              value integer
            )`, (err, res) => {
              if (err) {
                console.log('error creating characteristic_averages table');
              } else {
                pool.query(`CREATE TABLE IF NOT EXISTS characteristic_averages (
                  id integer,
                  product_id integer,
                  characteristic_name text,
                  characteristic_id,
                  average_value integer
                )`, (err, res) => {
                  if (err) {
                    console.log('error creating characteristic_review table');
                  } else {
                    console.log('characteristic_reviews table created');
                    pool.end();
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});



//USING PROMISES (seemed to only create reviews table)

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
//   helpfulness integer )`)
//   .then((res) => {
//     console.log('reviews table created');
//     pool.query(`CREATE TABLE IF NOT EXISTS characteristics (
//       id integer,
//       product_id integer,
//       name varchar)`);
//   })
//   .then((res) => {
//     console.log('characteristics table created');
//     pool.query(`CREATE TABLE IF NOT EXISTS reviews_photos (
//       id integer,
//       product_id integer,
//       url varchar
//         )`);
//   })
//   .then((res) => {
//     console.log('reviews_photos table created');
//     pool.query(`CREATE TABLE IF NOT EXISTS characteristic_review (
//       id integer,
//       characteristic_id integer,
//       review_id integer,
//       value integer
//       )`);
//   })
//   .then((res) => {
//     pool.end();
//   })
//   .catch((err) => {
//     console.log(err);
//   });
