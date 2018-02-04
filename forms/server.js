const http = require('http');
const st = require('st');
const qs = require('querystring');
const port = 8000;

var mount = st({
  path: 'public/',
  index: 'index.html'
});

const server = http.createServer((req, res) => {
  if (req.url === '/test') {
     handleFormTest(req, res); 
} else { 
  mount(req, res);
}
});

server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
});




function handleFormTest(req, res) {
  console.log('\nForm data received:\n');
  console.log(req.headers);
  console.log('\n');
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString('utf8');
  });



  req.on('end', () => {
    const form = qs.parse(body);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
 
 res.end ('<p>Hello, ' + form.firstname + ' ' + form.lastname + '<br>' + 
	  '<p>Flavor Checked: ' + form.flavor + '<br>' +
	  '<p>Size Selected: ' + form.size + '<br></p>'); 
 
  });
}
