var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

var users = {};

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('login', function (userName) {
        users[socket.id] = userName;
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', {user:users[socket.id],message: msg});
    });
     socket.on('typing', function (sg) {
        io.emit('typing', users[socket.id]);
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});