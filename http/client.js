var net = require('net');
var client = new net.Socket();
client.connect(8000, '127.0.0.1', function() {
		console.log('Connected');
		client.write('GET / HTTP/1.1  \r\n' +
			     'Host: localhost \r\n' +
			     '\r\n');
});
var i = 0;
client.on('data', function(data) {
		console.log('Received: ' + data);
		i++;
		if(i==2)
				client.destroy(); 
});
client.on('close', function() {
		console.log('Connection closed');
});
