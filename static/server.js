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
	    mounts(req, res)
	}
	else {
	mount(req, res);
	}
}).listen(8000)

