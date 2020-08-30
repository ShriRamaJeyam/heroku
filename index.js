const http = require('http');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const env_loader = require('./env');

const port = normalizePort(process.env.PORT || '5000');
const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

// Routes
app.use('/password-manager',require('./applications/password-manager'));

app.use(function (req, res) {
  res.end('<h1>Om Namo Narayanaya</h1>');
});

const server = http.createServer(app);
server.listen(port);
server.on('error', (error) => console.error(error) );
server.on('listening', () => console.log(`Server is listening on port ${port}`));

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}