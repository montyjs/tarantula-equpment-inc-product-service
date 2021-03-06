/* eslint-disable no-console */
const { Pool } = require('pg');

const pool = process.env.NODE_ENV === 'production'
  ? new Pool({
    connectionString: process.env.DB_URI,
  })
  : new Pool({
    user: process.env.LOCAL_USER,
    host: 'localhost',
    database: 'product_wrapper',
    password: process.env.LOCAL_PASSWORD,
    port: '5432',
  });


const getAllImages = (cb) => {
  const queryString = 'SELECT * FROM images';
  console.log(pool.options);
  pool.query(queryString, (err, result) => {
    if (err) {
      console.log(err);
      return cb(err, null);
    }
    return cb(null, result.rows);
  });
};

const getRandomProduct = (cb) => {
  console.log(process.env.NODE_ENV);

  // gets one random row from the database
  const queryString = 'SELECT * FROM products ORDER BY RANDOM() LIMIT 1;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.log(err);
      return cb(err, null);
    }
    const shoeSizeQueryString = 'SELECT * FROM shoe_size;';
    return pool.query(shoeSizeQueryString, (sizeErr, sizes) => {
      if (sizeErr) {
        console.log(err);
        return cb(sizeErr, null);
      }
      const response = {
        shoe_sizes: sizes.rows,
        ...result.rows[0],
      };
      return cb(null, response);
    });
  });
};


module.exports = {
  pool,
  getAllImages,
  getRandomProduct,
};
