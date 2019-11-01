const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')));
app.get('/favicon.png', (req, res) => res.sendFile(path.join(__dirname + '/favicon.png')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname + '/manifest.json')));
app.get('/app_icon.png', (req, res) => res.sendFile(path.join(__dirname + '/app_icon.png')));
app.get('/assets/bundle.tapo', (req, res) => res.sendFile(path.join(__dirname + '/../../bundle.tapo')));
app.use('/build', express.static(path.join(__dirname, '../build')));
app.use('/assets', express.static(path.join(__dirname, '../../assets')));
app.listen(port, () => console.log(`Devserver listening on port ${port}`));