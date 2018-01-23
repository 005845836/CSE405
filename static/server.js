const http = require('http');
const st = require('st');

const port = 8000;

var mount = st({
	  path: 'public/',
	  index: 'index.html'
});

var mounts = st({
	path: 'public/',
	index: 'hi.html'
});


http.createServer(function(req, res) {
	if (req.url === '/hi') { 
	    res.set('Content-Type', 'text/html');
	    res.send(new Buffer('<div> You Requested /hi</div>'));
	}
	else {
	mount(req, res);
	}
}).listen(8000)

