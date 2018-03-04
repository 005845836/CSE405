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
    const params =  { color: color };
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
