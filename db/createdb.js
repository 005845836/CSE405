//CreateDB.js
//
const pg = require('pg');

process.env.PGDATABASE = 'db';

const pool = new pg.Pool();

pool.on('error', (err, client) => {
  console.log(err.stack);
  process.exit(-1);
});

pool.connect((err, client, done) => {
  if (err) throw err;
  const q = ' create table users (                 ' +
            ' username varchar(255) primary key,   ' +
            ' password varchar(255) not null,      ' +
            ' color char(6),                       ' +
            ' paragraph varchar(255)               ' +
            ');                                     ';
  client.query(q, (err) => {
    if (err) throw err;
    insertUser(client, done);
  });
});


function insertUser(client, username, password, color, paragraph, cb) {
  const q = "insert into users values ('fred', '1234', '0000FF', '')";
  client.query(q, (err) => {
  if (err) throw err;
  pool.end();
  });
}

