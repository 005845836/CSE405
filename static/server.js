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
		
	   res.send("<div> You Requested /hi</div>");
		
	}
	else {
	mount(req, res);
	}
}

