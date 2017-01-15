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
        socket.broadcast.emit('joined', userName);
    });
    socket.on('chat message', function (msg) {
        io.emit('chat message', {user:users[socket.id],message: msg});
    });
    socket.on('disconnect', function () {
        socket.broadcast.emit('left', users[socket.id]);
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});