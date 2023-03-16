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
pool.query('DROP TABLE reviews', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log('reviews table dropped:', res);
    pool.end();
  }
});