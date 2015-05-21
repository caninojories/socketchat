var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('marker', function(data) {
  
  console.log('marker latitude: ' + data.lat + ', marker longitude:' + data.lng);
    socket.broadcast.emit('show-marker', data);
    });

});

http.listen(3000, function(){
  console.log('five minute catch up is on port 3000');
});

module.exports = server;

