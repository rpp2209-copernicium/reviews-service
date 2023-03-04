require("dotenv").config();
const { Client } = require('pg');
const client = new Client();

client.connect()
  // .then(()=> {
  //   console.log('connected!');
  // });

client.query('SELECT $1::text as message', ['Hello world!'], (err, res) => {
  console.log(err ? err.stack : res.rows[0].message);
  // Hello World!
  client.end();
});