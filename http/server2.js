var http = require('http');

http.createServer(function (req, res) {
	// add http header:
const html = 
		"<html>" +
		"<head><title>405</title></head>" + 
		"<body><h1>Hi</h1></body>" + 
		"</html>";
res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(html);
	res.end();
}).listen(8000);
