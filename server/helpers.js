/* eslint-disable camelcase */
/* eslint-disable indent */
require ('dotenv').config();
const path = require('path');
const { Pool, Client } = require('pg');
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
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

  if (sort === 'newest' || !sort) {
    var orderBy = 'date';
  } else if (sort === 'helpfulness') {
    var orderBy = 'helpfulness';
  }

  pool.query(`SELECT * FROM reviews
  WHERE product_id = ${productId}
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
//SETUP STRUCTURE FOR RETURN DATA
  var metadata = {
    'product_id': prodId,
    'ratings': {},
    'recommended': {},
    'characteristics': {}
  };
//POPULATE RECOMMEND AND RATINGS OBJECTS
  pool.query(`SELECT COUNT (CASE WHEN rating = 1 THEN 1 END) as rating_1,
  COUNT (CASE WHEN rating = 2 THEN 1 END) as rating_2,
  COUNT (CASE WHEN rating = 3 THEN 1 END) as rating_3,
  COUNT (CASE WHEN rating = 4 THEN 1 END) as rating_4,
  COUNT (CASE WHEN rating = 5 THEN 1 END) as rating_5,
  COUNT (CASE WHEN recommend = true THEN 1 END) as recommend_true,
  COUNT (CASE WHEN recommend = false THEN 1 END) as recommend_false
  FROM reviews WHERE product_id = ${prodId}`, (err, res) => {
    if (err) {
      callback(err);
    } else {
      console.log('res', res.rows);
      var ratingsRows = res.rows;
      var ratings = metadata['ratings'];
      var recommended = metadata['recommended'];
      ratings['1'] = ratingsRows[0].rating_1;
      ratings['2'] = ratingsRows[0].rating_2;
      ratings['3'] = ratingsRows[0].rating_3;
      ratings['4'] = ratingsRows[0].rating_4;
      ratings['5'] = ratingsRows[0].rating_5;
      recommended['true'] = ratingsRows[0].recommend_true;
      recommended['false'] = ratingsRows[0].recommend_false;
      //POPULATE CHARACTERISTIC OBJECT
      pool.query(`SELECT characteristic_id, AVG(value), name, reviews.product_id
      FROM characteristic_review
      JOIN characteristics ON characteristic_id = characteristics.id
      JOIN reviews ON review_id = reviews.id
      WHERE reviews.product_id = 20
      GROUP BY characteristic_id, name, reviews.product_id`, (err, result) => {
    if (err) {
      callback(err);
    } else {
      var charRows = result.rows;
      var metaChars = metadata['characteristics'];
      for (var i = 0; i < charRows.length; i++) {
        var currentChar = charRows[i];
        metaChars[currentChar.name] = {
          'id': currentChar.characteristic_id,
          'value': currentChar.avg
        };
      }
      callback(null, metadata);
    }
  });
    }
  });
};

//INSERT REVIEW INTO REVIEWS TABLE
var insertReview = (prodId, rating, summary, body, recommend, name, email, photos, characteristics, callback) => {

  //INSERT INTO REVIEWS TABLE
  pool.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  VALUES (${prodId}, ${rating}, (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)), '${summary}', '${body}', ${recommend}, false, '${name}', '${email}', 'null', 0)`, (err, result) => {
    if (err) {
      callback(err);
    } else {
      console.log(result);
      callback(null, result);

      //INSERT PHOTO URLS INTO REVIEWS_PHOTOS TABLE

      // var ids = [];
      // for (var i = 0; i < photos.length; i++) {
      //   ids.push(prodId);
      // }
      // const query = 'INSERT INTO reviews_photos (product_id, url) SELECT * FROM unnest($1::INT[], $2::TEXT[])';
      // const values = [ids, photos];
      // console.log('query string', query);

      // pool.query(query, values, (err, result) => {
      //   if (err) {
      //     callback(err);
      //   } else {

          //INSERT INTO CHARACTERISTIC_REVIEW TABLE
          //characteristics object:
            //{ "14": 3, "15": 5, "16": 3, "17": 2}
          //create an array of keys from characteristics object
          // var keys = Object.keys(characteristics);
          // var charIdOne = keys[0]
          // pool.query(`INSERT INTO characteristic_review (characteristic_id, review_id, value) VALUES (${ }), (${ }), (${ }), (${ })`)
        }
      });
    };
  // });
// };

module.exports.fetchReviews = fetchReviews;
module.exports.fetchMeta = fetchMeta;
module.exports.insertReview = insertReview;