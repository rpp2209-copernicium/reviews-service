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

};

module.exports.fetchReviews = fetchReviews;
module.exports.fetchMeta = fetchReviews;