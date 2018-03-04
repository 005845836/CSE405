const pg = require('pg');
process.env.PGDATABASE = 'express';
const pool = new pg.Pool();

pool.on('error', (err, client) => {
  console.log(err.stack);
  process.exit(-1);
});

function getUser(username, password, cb) {
  pool.connect((err, client, done) => {
    if (err) throw err;
    const q = "select color from users " +
              "where username=$1::text and password=$2::text";
    const params = [username, password];
    client.query(q, params, (err, result) => {
      if (err) {
        console.log(err.stack);
        cb(null);
      } else if (result.rows.length === 0) {
        cb(null);
      } else {
        const row = result.rows[0];
        cb({
          color: row['color']
        });
      }
      done();
    });
  });
}
 
function getUserColor(username, cb) { 
 pool.connect((err, client, done) => {
    if (err) throw err;
    const q = "select color from users where username=$1::text";
    const params = [username];
    client.query(q, params, (err, result) => {
      if (err) {
        console.log(err.stack);
        cb(null);
      } else if (result.rows.length === 0) {
        cb(null);
      } else {
        const row = result.rows[0];
        cb(row['color']);
      }
      done();
    });
  });
}
 
function setUserColor(username, color, cb) { 
  pool.connect((err, client, done) => {
    if (err) throw err;
    const q = "update users set color=$1::text where username=$2::text";
    const params = [color, username];
    client.query(q, params, (err, result) => {
      if (err) {
        console.log(err.stack);
       }
        done();
	cb();
    });
  });
}

exports.getUser 	= getUser; 
exports.getUserColor    = getUserColor; 
exports.setUserColor    = setUserColor;


