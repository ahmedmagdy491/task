var express = require('express');
var app = express();
// … Configure Express, and register necessary route handlers
const port = 4000;
srv = app.listen(port, () => console.log('server rinning', port));
app.use(
	'/peerjs',
	require('peer').ExpressPeerServer(srv, {
		debug: true,
	})
);
