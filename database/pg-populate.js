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

//POPULATE DB

var photosPath = path.resolve(__dirname, '../../csv-data/reviews_photos.csv');
var reviewsPath = path.resolve(__dirname, '../../csv-data/reviews.csv');
var characteristicsPath = path.resolve(__dirname, '../../csv-data/characteristics.csv');
var characteristicReviewPath = path.resolve(__dirname, '../../csv-data/characteristic_review.csv');
pool.query(`COPY reviews_photos FROM '${photosPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
  if (err) {
    console.log('error copying reviews_photos');
  } else {
    console.log('reviews_photos copied');
    pool.query(`COPY reviews FROM '${reviewsPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
      if (err) {
        console.log('error copying reviews');
        pool.end();
      } else {
        console.log('reviews copied');
        pool.query(`COPY characteristics FROM '${characteristicsPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
          if (err) {
            console.log('error copying characteristics');
            pool.end();
          } else {
            console.log('characteristics copied');
            pool.query(`COPY characteristic_review FROM '${characteristicReviewPath}' DELIMITER ',' CSV HEADER;`, (err, res) => {
              if (err) {
                console.log('error copying characteristic_reviews');
                pool.end();
              } else {
                console.log('characteristic_reviews copied');
                pool.end();
              }
            });
          }
        });
      }
    });
  }
});



//ADD CHARACTERISTIC NAME TO EVERY ROW IN characteristic_review

//grab every characteristic id
// pool.query('SELECT characteristic_id FROM characteristic_review;')
//   .then((result) => {
//   //iterate over the ids
//     var charIds = result.rows;
//     console.log(charIds[0]);
//     for (var i = 0; i < charIds.length; i++) {
//       //at each id
//       var currentId = charIds[i];
//       //find the characteristic name
//       pool.query(`SELECT name FROM characteristics WHERE id=${currentId}`)
//         .then((result) => {
//           var charName = result[0].name;
//           console.log(charName);
//         });
//     }
//   //insert the characteristic name value into the characteristic name column of the characteristic_review table
//   });

// pool.query('SELECT characteristic_id FROM characteristic_review;', (err, res) => {
//   if (err) {
//     console.log('level 1 error', err);
//   } else {
//     var charIds = result.rows;
//     console.log(charIds[0]);
//     for (var i = 0; i < charIds.length; i++) {
//       //at each id
//       var currentId = charIds[i];
//       //find the characteristic name
//       pool.query(`SELECT name FROM characteristics WHERE id=${currentId}`)
//         .then((result) => {
//           var charName = result[0].name;
//           console.log(charName);
//         });
//     }
//   }
// });


//POPULATE CHARACTERISTIC_AVERAGES

// var prodId = 71703;

// pool.query(`SELECT product_id FROM reviews;`)
//   .then((result) => {
//     var productRows = result.rows;
//     //iterate over all the product ids
//     for (var i = 0; i < productRows.length; i++) {
//       //at each product id
//       var currentProductId = productRows[i].product_id;
//       //grab all the review ids for that product id
//       pool.query(`SELECT * FROM reviews WHERE product_id = ${currentProductId};`)
//         .then((result) => {
//           //result is all of the reviews for the current product
//           var productRows = result.rows;
//           //iterate over the reviews
//           for (var i = 0; i < productRows.length; i++) {
//             //at each review
//             var currentReview = productRows[i].id;
//             //query for all the characteristic ids associate with current review
//             pool.query(`SELECT characteristic_id FROM characteristic_review WHERE review_id = ${currentReview};`)
//               .then((result) => {
//                 var charRows = result.rows;
//                 //iterate over the characteristic ids (result)
//                 for (var i = 0; i < charRows.length; i++) {
//                   //for each characteristic id
//                   var currentChar = charRows[i].characteristic_id;
//                   //grab the name of that characteristic from characteristic table
//                   pool.query(`SELECT name FROM characteristics WHERE id=${currentChar}`)
//                     .then((result) => {
//                       var charName = result[0].name;
//                       //retrieve all values for current product associated with current characteristic name

//                     });
//                 }



                //find the average of all the values
                //add entry into characteristic_averages table
                //with prod_id, char_name, char_id, avg_value
  //             });

  //         }
  //       });
  //   }
  // })

  // .catch((err) => {
  //   console.log(err);
  // });


          // var reviewRows = result.rows;
          // for (var j = 0; j < reviewRows.length; j++) {
          //   var reviewId = reviewRows[j].id;
          //   //iterate over characteristic ids
          //   console.log(reviewRows);
            // pool.query('SELECT * FROM characteristic_review WHERE review_id = 414000;', (err, result) => {
            //   if (err) {
            //     console.log(err);
            //   } else {
            //     var charRows = result.rows;
            //     for (var k = 0; k < charRows.length; k++ ) {
            //       var currentCharId = charRows[k].characteristic_id;
            //       console.log(currentCharId);
            //     }
            //   }
            // });
//           }
//         }
//       });
//     }
//   }
// });

//for every product...
//fetch all the review ids for current product_id
//for each review id
//  fetch all characteristic ids
//  for each characteristic id
//    retrieve all values for current product associated with current characteristic name
//    find the average of all the values
//    add entry into characteristic_averages table
//      with prod_id, char_name, char_id, avg_value

