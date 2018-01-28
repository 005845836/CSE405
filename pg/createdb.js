//Setup
const pg = require('pg');
process.env.PGDATABASE = 'pg';
const pool = new pg.Pool();
pool.on('error', (err, client) => {
  console.log(err.stack);
  process.exit(-1);
});

// Utility Functions

function insertRow(client, id, x, cb) { 
  client.query("insert into test values ($1::text, $2)", [id, x], (err) => {
    if (err) throw err; else cb();
  });
}
 
function selectAll(client, cb) {
  client.query("select * from test", (err, res) => {
    if (err) throw err;
    console.log("\nselect* from test"); 
    res.rows.forEach((row) => {	
    	console.log(row.id + ' ' + row.x);
	});
    cb();
  });
}


function selectById(client, id, cb) { 
	client.query("select * from test where id=$1::text", [id], (err, res) => {
		if (err) throw err;
		console.log("\nSelect * from test where id = b");
		res.rows.forEach((row) => {
			console.log(row.id + ' ' + row.x);
		});
	cb();
	});
}

function updateRow(client, id, x, cb) {
  client.query("update test set x = $1 where id = $2::text", [x, id], (err) => {
    if (err) throw err;
    cb();
});
 }


function deleteRow(client, id, cb) {
  client.query("delete from test where id = $1::text", [id], (err) => {
    if (err) throw err;
    cb();
});
 }



// Main Function 
pool.connect((err, client, done) => {
  if (err) throw err; 
  createTest(client, done);
}); 


//Create Table Test 
function createTest(client, done) {
  const q = 'create table test (            ' +
            '  id varchar(255) primary key, ' +
            '  x integer                    ' +
            ')                              ';
  client.query(q, (err) => {
    if (err) throw err; else insertA(client, done);
  });
}

function insertA(client, done) {
  insertRow(client, 'a', 1, () => {
    insertB(client, done);
  });
}

function insertB(client, done) {
  insertRow(client, 'b', 2, () => {
    insertC(client, done);
  });
}


function insertC(client, done) {
  insertRow(client, 'c', 3, () => {
  selectB(client, done);
  });
}

function selectB(client, done) {
  selectById(client, 'b', () => {
    updateB(client, done);
	});
}

function updateB(client, done) { 
 updateRow(client, 'b', 22, () => {  
   selectAll1(client, done); 
  });
}


function selectAll1(client, done) { 
  selectAll(client, () => { 
  deleteB(client, done); 
}); 
}

function deleteB(client, done) { 
  deleteRow(client, 'b', () => {
	selectAll2(client, done);
}); 

}


function selectAll2(client, done) { 
  selectAll(client, () => { 
  myEnd(client, done);
 }); 
}


function myEnd(client, done) {
 done(); 
 pool.end(); 
}
