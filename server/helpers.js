/* eslint-disable camelcase */
/* eslint-disable indent */
const path = require('path');
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: 'fig',
  host: 'localhost',
  database: 'reviews',
  password: '',
  port: 5432
});

//FETCH REVIEWS FOR A GIVEN PRODUCT
var fetchReviews = (callback, productId, sort, count, page) => {
  if (count) {
    var resultCount = count;
  } else {
    var resultCount = 5;
  }
  if (page) {
    var resultPage = page;
  } else {
    var resultPage = 1;
  }
  if (resultPage === 1) {
    var offSet = 0;
  } else if (resultPage >= 2) {
    var offSet = resultCount * (resultPage - 1);
  }

  pool.connect();

  if (sort === 'newest' || sort === null) {
    var orderBy = 'date';
  } else if (sort === 'helpfulness') {
    var orderBy = 'helpfulness';
  }

  pool.query(`SELECT * FROM reviews
  ORDER BY ${orderBy} DESC
  LIMIT ${resultCount}
  OFFSET ${offSet}`)
    .then((result) => {
      var data = result.rows;
      var results = {
        'product': productId,
        'page': resultPage,
        'count': resultCount,
        'results': data
      };
      callback(null, results);
      pool.end();
    })
    .catch((err) => {
      callback(err);
    });

};

//FETCH REVIEW METADATA FOR A GIVEN PRODUCT

var fetchMeta = (prodId, callback) => {

  pool.connect();


  pool.query(`SELECT id FROM characteristics
  WHERE product_id = ${prodId}
  GROUP BY name`, (err, result) => {
    if (err) {
      callback(err);
    } else {
      var charRows = result.rows;
      callback(null, charRows);

    }
  });

  //query the characteristics table to find all the characteristic ids associated with the product
  //iterate over the characteristic ids
  //for each characteristic id...
  //grab the characteristic name
  //query the characteristic_review table for all results with the current characteristic id
   //calculate the average of all the values in the value row
};

//INSERT REVIEW INTO REVIEWS TABLE

var insertReview = (prodId, rating, summary, body, recommend, name, email, photos, characteristics) => {

  pool.connect();

  //insert initial values into reviews table
  pool.query(`INSERT INTO reviews (product_id, rating, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  VALUES (${prodId}, ${rating}, ${summary}, ${body}, ${recommend}, false, ${name}, ${email}, null, 0)`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      //iterate over the array of photo urls??
      //run insert query at every iteration
      pool.query(`INSERT INTO reviews_photos (product_id, url)
      VALUES (${prodId}, ${currentUrl})`);
    }
  });



  //add characteristics into characteristic table
  //characteristics object Object of keys representing characteristic_id and
  //values representing the review value for that characteristic.
  //{ "14": 5, "15": 5 //...}
};

module.exports.fetchReviews = fetchReviews;
module.exports.fetchMeta = fetchMeta;