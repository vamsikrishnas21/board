var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket)=> {
      console.log('connection established');

      socket.on('collabdata', (data)=> {
            socket.broadcast.emit('collabdata', data);
            
      })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;
http.listen(server_port, () => {
    console.log("Server Started on : "+ server_port);
})