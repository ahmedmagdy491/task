var express = require('express');
var app = express();
require('dotenv/config');
// … Configure Express, and register necessary route handlers
const port = process.env.PORT;
srv = app.listen(port, () => console.log('server rinning', port));
app.use(
	'/peerjs',
	require('peer').ExpressPeerServer(srv, {
		debug: true,
	})
);
