require("dotenv").config();
const express = require('express');
const app = express();
const port = 3000;
const { fetchReviews } = require('./helpers.js');
const { fetchMeta } = require('./helpers.js');
const { insertReview } = require('./helpers.js');
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
  if (!req.body.rating) {
    var rating = null;
  } else {
    var rating = req.body.rating;
  }
  if (!req.body.summary) {
    var summary = null;
  } else {
    var summary = req.body.summary;
  }
  if (!req.body.body) {
    var body = null;
  } else {
    var body = req.body.body;
  }
  if (!req.body.recommend) {
    var recommend = null;
  } else {
    var recommend = req.body.recommend;
  }
  if (!req.body.reviewer_name) {
    var name = null;
  } else {
    var name = req.body.reviewer_name;
  }
  if (!req.body.email) {
    var email = null;
  } else {
    var email = req.body.email;
  }
  if (!req.body.photos) {
    var photos = [];
  } else {
    var photos = req.body.photos;
  }
  if (!req.body.characteristics) {
    var characteristics = null;
  } else {
    var characteristics = req.body.characteristics;
  }
  insertReview(prodId, rating, summary, body, recommend, name, email, photos, characteristics, (err, result) => {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    } else {
      res.status(201);
      res.send('success');
    }
  });
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