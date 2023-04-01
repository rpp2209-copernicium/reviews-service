require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;
const { fetchReviews } = require('./helpers.js');
const { fetchMeta } = require('./helpers.js');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//ROUTES

app.get('/reviews', (req, res) => {
  var prodId = req.query.product_id;
  var sortBy = req.query.sort;
  var resultCount = req.query.count;
  var resultPages = req.query.page;
  fetchReviews((err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    } else {
      res.status(200).send(result);
    }
  }, prodId, sortBy, resultCount, resultPages);
});

app.get('/reviews/meta', (req, res) => {
  var prodId = req.query.product_id;
  fetchMeta(prodId, (err, result) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200);
      res.send(result);
    }
  });
});

app.post('/reviews', (req, res) => {
  //req.body will access data sent in the axios req at the 'data' property
  //set default values for body parameters that are optional
  var prodId = req.body.product_id;
  var rating = req.body.rating;
  var summary = req.body.summary;
  var body = req.body.body;
  var recommend = req.body.recommend;
  var name = req.body.name;
  var email = req.body.email;
  var photos = req.body.photos;
  var characteristics = req.body.characteristics;
  console.log('photos', photos);
  console.log('chars', characteristics);
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