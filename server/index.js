require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'fig',
  host: 'localhost',
  database: 'reviews',
  password: '',
  port: 5432
});

app.use(express.urlencoded({extended: false}));
app.use(express.json());


//CONNECT TO DB
pool.connect()
  .then((res) => {
    console.log('connected');
  });
//connect to postgres db
//  initially to localhost

//ROUTES

app.get('/reviews', (req, res) => {
  var prodId = req.query.product_id;
  var sortBy = req.query.sort;
  //sort by options are newest, helpful, or relevant
  var resultCount = req.query.count;
  //if not specified, default count === 5
  var resultPages = req.query.page;
  //if not specified, default page === 1

  //use the params to query the db
  //send data back to the client
  res.status(200);
  res.send('data');
});

app.get('/reviews/meta', (req, res) => {
  var prodId = req.query.product_id;
  res.status(200);
  res.send('meta data');
});

app.post('/reviews', (req, res) => {
  //req.body will access data sent in the axios req at the 'data' property
  var prodId = req.body.product_id;
  var rating = req.body.rating;
  var summary = req.body.summary;
  var body = req.body.body;
  var recommend = req.body.recommend;
  var name = req.body.name;
  var email = req.body.email;
  var photos = req.body.photos;
  var characteristics = req.body.characteristics;
  res.sendStatus(201);
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  var reviewId = req.params.review_id;
  res.send(reviewId);
});

app.put('/reviews/:review_id/report', (req, res) => {
  var reviewId = req.params.review_id;
  res.send(reviewId);
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});