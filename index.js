const http = require('http');
http.createServer(function (req, res) {
    res.write('Om Namo Narayanaya'); 
    res.end();
  }).listen(8080);