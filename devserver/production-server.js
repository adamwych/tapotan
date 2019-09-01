const express = require('express');
const path = require('path');
const app = express();
const port = 80;
const request = require('request');

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		
	if (req.headers && 'host' in req.headers && req.headers.host.toLowerCase() === 'api.tapotan.com') {
		const requestURL = req.url;
		let proxyURL;
		if (requestURL.substr(0, 1) === '/') {
			proxyURL = 'http://localhost:3001' + requestURL;
		} else {
			proxyURL = 'http://localhost:3001/' + requestURL;
		}
		
		let callback = (error) => {
			if (error) {
				console.log(error.message);
				res.send({ success: false, error: 'server_down' });
			}
		};
		
		let r = null;
		if (req.method === 'POST') {
			r = request.post({ uri: proxyURL, json: req.body }, callback);
		} else {
			r = request(proxyURL, callback);
		}

		req.pipe(r).pipe(res);
	} else {
		next();
	}
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
app.get('/favicon.jpg', (req, res) => res.sendFile(path.join(__dirname + '/favicon.jpg')));
app.use('/build', express.static(path.join(__dirname, './build')));
app.use('/assets', express.static(path.join(__dirname, './assets')));

app.listen(port, () => console.log(`Server listening on port ${port}.`));