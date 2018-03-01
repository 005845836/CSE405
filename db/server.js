//Server.js
const http     = require('http');
const qs       = require('querystring');
const sessions = require('./sessions');
const st       = require('st');
const fs       = require('fs');
const db       = require('./db');


const mount = st({
path: 'public/'
});

const homeTemplate  = fs.readFileSync('views/home.html' , 'utf8');
const colorTemplate = fs.readFileSync('views/color.html', 'utf8');
const loginTemplate = fs.readFileSync('views/login.html', 'utf8');
const paraTemplate  = fs.readFileSync('views/para.html' , 'utf8');

const server = http.createServer();

var message=''; 

server.listen(8000);

server.on('request', (req, res) => {
        sessions.filter(req, res);
        if (req.url === '/login.html'){
	      handleLoginPage(req, res); 
	}else if (req.url === '/login') {
		handleLogin(req, res);
	}else if (!req.session.hasOwnProperty('username')){
		redirectLoginPage(res); 
	}else if (req.url === '/logout') {
		handleLogout(req, res);      
	}else if (req.url === '/color') {
                handleColorForm(req, res);
	}else if (req.url === '/color.html') {
               handleColorPage(req, res);
	}else if (req.url === '/') {
		handleHomePage(req, res); 
	}else {
		mount(req, res); 
 }
});



function handleLoginPage(req, res) {
res.setHeader('Content-type', 'text/html');
      const html = loginTemplate.replace('#message#', message);
      res.end(html);
}

function handleHomePage(req, res) { 
        db.getUserColor(req.session.username, (color) => {
           res.setHeader('Content-type', 'text/html');
           const html = homeTemplate.replace('#color#', color);
	   res.end(html);
});
//	 db.setUserPara(req.session.username, (para) => {
//	   res.setHeader('Content-type', 'text/html');
//	   const html = homeTemplate.replace('#para#', para);
//	   res.end(html); 
	
//});
}
function handleColorPage(req, res) {
db.getUserColor(req.session.username, (color) => {
    var html;
    switch (color) {
    case 'FF0000':
      html = colorTemplate.replace('#red#'   , 'checked');
      html = html         .replace('#green#' , '       ');
      html = html         .replace('#blue#'  , '       ');
      break;
    case '00FF00':
      html = colorTemplate.replace('#red#'   , '       ');
      html = html         .replace('#green#' , 'checked');
      html = html         .replace('#blue#'  , '       ');
      break;
    case '0000FF':
      html = colorTemplate.replace('#red#'   , '       ');
      html = html         .replace('#green#' , '       ');
      html = html         .replace('#blue#'  , 'checked');
      break;
    default:
      html = colorTemplate.replace('#red#'   , '       ');
      html = html         .replace('#green#' , '       ');
      html = html         .replace('#blue#'  , '       ');
      break;
  }
  res.setHeader('Content-type', 'text/html');
  res.end(html);
});



}
function handleLogin(req, res) {
        let body = '';
        req.on('data', (chunk) => {
                body += chunk;
        });
        req.on('end', () => {
                const form = qs.parse(body);
                if (form.username !== 'fred'){
			message = 'Bad Username ';	
			redirectLoginPage(res);        
	 	} else if (form.password !== '1234'){
			message = ' Bad Password ';
			redirectLoginPage(res);	
	        }else {
			req.session.username = form.username;
			redirectHomePage(res);
        
}
  });
}

function handleLogout(req, res){
        let body = '';
        req.on('data', (chunk) => {
                body += chunk;
        });
        req.on('end', () => {
                const form = qs.parse(body);
		delete req.session.username;
		message = '';
		redirectLoginPage(res);
});
}
function redirectLoginPage(res) { 
   res.statusCode = 301; 
   res.setHeader('Location', '/login.html');
   res.end();
}


function redirectHomePage(res) { 
   res.statusCode = 301; 
   res.setHeader('Location', '/');
   res.end();
}


function redirectLogout (res) {
delete req.session.username;
redirectLoginPage(res);
}

function handleColorForm(req, res) {
        let body = '';
        req.on('data', (chunk) => {
                body += chunk;
        });
        req.on('end', () => {
                const form = qs.parse(body);
                if (
                    form.color !== 'FF0000' &&
                    form.color !== '00FF00' &&
                    form.color !== '0000FF'
                ) {
                    res.writeHead(400);
                    res.end('Bad request');
                }
 		db.setUserColor(req.session.username, form.color, () => {
                res.writeHead(302, { 'Location': '/' });
                res.end();
	});
      });
}



