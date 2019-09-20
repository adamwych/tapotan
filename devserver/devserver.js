const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
app.get('/favicon.jpg', (req, res) => res.sendFile(path.join(__dirname + '/favicon.jpg')));
app.get('/assets/bundle.tapo', (req, res) => res.sendFile(path.join(__dirname + '/../../AssetsBundle.tapo')));
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.listen(port, () => console.log(`Devserver listening on port ${port}`));