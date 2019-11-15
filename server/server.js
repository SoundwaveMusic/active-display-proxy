const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const rp = require('request-promise');
var proxy = require('http-proxy-middleware');

const app = express();
const port = 3059;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.resolve(__dirname,'..','public')));

app.use('/api/song/:id/comments', proxy({ target: 'http://ec2-13-56-194-113.us-west-1.compute.amazonaws.com/'}));

app.get('/', (_, response) => {
  response.send(express.static(__dirname, '..', 'public', 'index.html'));
});

app.get('/api/song/:id/comments', (req, res, next) => {
  const url = `http://localhost:3050/api/song/${req.params.id}/comments`
  rp(url)
    .then(data => res.send(data))
    .catch(err => next(err))
})

app.listen(port, () => {
  console.log('Proxy server is up and running on port', port);
});
