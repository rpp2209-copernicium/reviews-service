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
pool.connect()
  .then((res) => {
    console.log('connected');
  });
//connect to postgres db
//  initially to localhost

//FETCH REVIEWS
var fetchReviews = (productId, sort, count, page) => {
  //if count is provided
  //  create count variable and set to input count
  //  otherwise set count variable to 5
  //if page is provided
  //  create page variable and set to input page
  //  otherwise set page variable to 1

  //connect to the database

  //sort by newest, helpfulness, relevant
  //helpfulness column contains an integer
  //date column contains a timestamp
  //there is nothing in the db data corresponding to relevance

  //if given sort argument is newest
  if (sort === 'newest') {
    //  set order by variable to date
    var orderBy = 'date';
  }
  //if given sort argument is helpfulness
  if (sort === 'helpfulness') {
    //  set order by variable to helpfulness
    var orderBy = 'helpfulness';
  }

  pool.query(`SELECT * FROM reviews
  ORDER BY ${orderBy} DESC
  LIMIT 10`, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });


  //dont return reported questions
};