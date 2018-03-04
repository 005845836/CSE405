const pg = require('pg');
process.env.PGDATABASE = 'express';
const pool = new pg.Pool();

pool.on('error', (err, client) => {
  console.log(err.stack);
  process.exit(-1);
});

pool.connect((err, client, done) => {
  if (err) throw err; 
  const q = 'create table users (                 ' +
            '  username varchar(255) primary key, ' +
            '  password varchar(255) not null,    ' +
	    '  color char(6)			  ' +
            ')                                    ' ;
  client.query(q, (err) => {
    if (err) throw err; 
    insertUser(client, done);
  });
});

function insertUser(client, done) {
   const q = "insert into users values ('fred', '1234', '0000FF')";
   client.query(q, (err) => {
	if (err) throw err; 
	done();
	pool.end();
});
}
