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
  pool.connect();

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
  var metadata = {
    'product_id': prodId,
    'ratings': {},
    'recommended': {},
    'characteristics': {}
  };
  //POPULATE CHARACTERISTICS OBJECT
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
      //POPULATE RATINGS OBJECT
      pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND rating = 0`, (err, result) => {
        if (err) {
          console.log(error);
        } else {
          metadata['ratings']['0'] = result.rows[0].count;
          pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND rating = 1`, (err, result) => {
            if (err) {
              callback(err);
            } else {
              metadata['ratings']['1'] = result.rows[0].count;
              pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND rating = 2`, (err, result) => {
                if (err) {
                  callback(err);
                } else {
                  metadata['ratings']['2'] = result.rows[0].count;
                  pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND rating = 3`, (err, result) => {
                    if (err) {
                      callback(err);
                    } else {
                      metadata['ratings']['3'] = result.rows[0].count;
                      pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND rating = 4`, (err, result) => {
                        if (err) {
                          callback(err);
                        } else {
                          metadata['ratings']['4'] = result.rows[0].count;
                          pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND rating = 5`, (err, result) => {
                            if (err) {
                              callback(err);
                            } else {
                              metadata['ratings']['5'] = result.rows[0].count;
                              //POPULATE RECOMMENDED OBJECT
                              pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND recommend = true`, (err, result) => {
                                if (err) {
                                  callback(err);
                                } else {
                                  metadata['recommended']['true'] = result.rows[0].count;
                                  pool.query(`SELECT COUNT (*) FROM reviews WHERE product_id = ${prodId} AND recommend = false`, (err, result) => {
                                    if (err) {
                                      callback(err);
                                    } else {
                                      metadata['recommended']['false'] = result.rows[0].count;
                                      callback(null, metadata);
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
                }
              });
            }
          });
        }
      });
    }
  });
};

//INSERT REVIEW INTO REVIEWS TABLE
var insertReview = (prodId, rating, summary, body, recommend, name, email, photos, characteristics, callback) => {

  pool.connect();

  //INSERT INTO REVIEWS TABLE
  pool.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
  VALUES (${prodId}, ${rating}, (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)), '${summary}', '${body}', ${recommend}, false, '${name}', '${email}', null, 0)`, (err, result) => {
    if (err) {
      callback(err);
    } else {
      console.log('insert into reviews result', result);
      var ids = [];
      for (var i = 0; i < photos.length; i++) {
        ids.push(prodId);
      }
      //INSERT PHOTO URLS INTO REVIEWS_PHOTOS TABLE
      pool.query(`INSERT INTO reviews_photos (id, url) (SELECT * FROM unnest(${ids},${photos}))`, (err, res) => {
        if (err) {
          callback(err);
        } else {
          callback(null, result);

          //INSERT INTO CHARACTERISTIC_REVIEW TABLE
          //characteristics object:
            //{ "14": 3, "15": 5, "16": 3, "17": 2}
          //create an array of keys from characteristics object
          // var keys = Object.keys(characteristics);
          // var charIdOne = keys[0]
          // pool.query(`INSERT INTO characteristic_review (characteristic_id, review_id, value) VALUES (${ }), (${ }), (${ }), (${ })`)
        }
      });
    }
  });
};

module.exports.fetchReviews = fetchReviews;
module.exports.fetchMeta = fetchMeta;
module.exports.insertReview = insertReview;