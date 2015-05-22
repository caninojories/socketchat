var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require("path")
var port = process.env.PORT || 3000
var http = require('http').Server(app);
var markers = [];


app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/app/index.html'));
});


var io = require('socket.io')(http);

io.on('connection', function(socket){
  console.log('a user connected');
   markers.push(socket.id);
  
  socket.on('marker', function(data) {
  
  console.log('marker latitude: ' + data.lat + ', marker longitude:' + data.lng);
    socket.broadcast.emit('show-marker', data);
    });

});

http.listen(3000, function(){
  console.log('five minute catch up is on port 3000');
});

module.exports = server;
