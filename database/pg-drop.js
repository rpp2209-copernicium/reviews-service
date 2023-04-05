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

//DROP TABLES
pool.query('DROP TABLE if exists reviews cascade', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('reviews table dropped');
    pool.query('DROP TABLE if exists characteristics cascade', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('characteristics table dropped');
        pool.query('DROP TABLE if exists characteristic_review cascade', (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log('characteristic_review table dropped');
            pool.query('DROP TABLE if exists reviews_photos cascade', (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log('reviews_photos table dropped');
                pool.end();
              }
            });
          }
        });
      }
    });
  }
});