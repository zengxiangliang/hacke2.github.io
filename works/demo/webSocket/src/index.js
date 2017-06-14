/**
 * @author: xiangliang.zeng
 * @description:
 * @Date: 2017/6/14 0:03
 * @Last Modified by:   xiangliang.zeng
 * @Last Modified time: 2017/6/14 0:03
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', msg);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
