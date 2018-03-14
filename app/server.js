const http     = require('http');
const qs       = require('querystring');
const express  = require('express');
const sessions = require('./sessions');
const db       = require('./db');
const auth     = require('./auth');
const engine   = require('./engine');

const port = 8000;

const app              = express();
const static           = express.static('views');
const urlencodedParser = express.urlencoded({ extended: false });

app.use(static);
app.use(auth);

app.engine('html', engine);
app.set('views', './views');

app.get('/', function(req, res) {
  const username = req.session.username;
  db.getUserColor(username, (color) => {

    const params =  {
      color: color,
      // if user is admin, shows the link to the page "list of users"
      display: username === 'admin' ? 'block' : 'none'
    };
    res.render('home.html', { params: params });
  });
});


app.post('/color', urlencodedParser, (req, res) => {
  const username = req.session.username;
  const color = req.body.color;
  db.setUserColor(username, color, () => {
    res.redirect('/');
  }); 
});


app.get('/color.html', function(req, res) {
  const username = req.session.username;
  db.getUserColor(username, (color) => {
    const params =  { 
        color: color,
	red  : '',
	green: '',
	blue : ''
       };
       if      (color === 'FF0000') params.red   = 'checked';
       else if (color === '00FF00') params.green = 'checked';
       else if (color === '0000FF') params.blue  = 'checked';
       res.render('color.html', { params: params });
  });
});


// Processing clicking the link to a page with a list of users
app.get('/users_list', function (req, res) {
  const username = req.session.username;

  if(username === 'admin') {
    db.getUsersList((result) => {
      let users_list = [];
      for(let i=0;  i < result.result.rows.length; i++) {
        users_list.push(result.result.rows[i].username);
      }
      res.render('users_list.html', { params: {users_list: users_list} });
    });
  } else {
    res.redirect('/');
  }
});


// Processing clicking the link "Delete". Delete user from system.
app.get('/account/delete/:username', function (req, res) {
  if(req.session.username === 'admin') {
    const username = req.params.username;
    db.deleteUser(username, () => {
      res.redirect('/user_delete_success.html');
    });
  } else {
    // if user is not admin this page is forbidden to view
    res.redirect('/')
  }
});


// Processing clicking the link "Edit". Editing data of existing user in a system.
app.get('/account/edit/:username', function (req, res) {
  const username = req.params.username;
  if(req.session.username === 'admin') {
    db.getUserDataByUsername(username, (data) => {
      res.render('user_account.html', {params: {username: username, password: data.password}})
    });
  } else {
    // if user is not admin this page is forbidden to view
    res.redirect('/')
  }
});

// Processing clicking the "Edit Account" button.
app.post('/account/edit', urlencodedParser, function (req, res) {
  //checking that user is admin
  if(req.session.username === 'admin') {
    const username = req.body.username;
    const password = req.body.password;
    db.updateUser(username, password, () => {
      res.redirect('/user_edit_success.html');
    });
  } else {
    // if user is not admin this page is forbidden to view
    res.redirect('/')
  }
});


// Processing clicking the link "Create". Creating new user in a system.
app.get('/create_user', function (req, res) {
  // checking that user is admin
  if(req.session.username === 'admin') {
    res.render('user_account_create.html', {params: {}})
  } else {
    // if user is not admin this page is forbidden to view
    res.redirect('/')
  }
});


// Processing clicking the "Create" button.
app.post('/account/create', urlencodedParser, function (req, res) {
  // checking that user is admin
  if(req.session.username === 'admin') {
    const username = req.body.username;
    const password = req.body.password;
    //call function createUser from db module
    db.createUser(username, password, () => {
      res.redirect('/user_create_success.html');
    });
  } else {
    res.redirect('/')
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
