var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(2000);
console.log("Server started.");
 
var SOCKET_LIST = {};


 
var DEBUG = true;
var player = []; 
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
	x = Math.random();
    SOCKET_LIST[socket.id] = socket;
	socket.name = "default" + ("" + x).slice(2,6) ;
   
    //Player.onConnect(socket);
   
   
    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
       // Player.onDisconnect(socket);
    });
	
	 socket.on('AddPlayerToServer',function(data){
       // player[socket.id]= data;
        socket.name = data ;
		for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToPlayer', data);
        }
    });
	
	
    socket.on('sendMsgToServer',function(data){
//var playerName = ("" + socket.id).slice(2,7);
        for(var i in SOCKET_LIST){
            SOCKET_LIST[i].emit('addToChat', socket.name + ': ' + data);
        }
    });
   
   
    socket.on('evalServer',function(data){
        if(!DEBUG)
            return;
        var res = eval(data);
        socket.emit('evalAnswer',res);     
    });
   
   
   
});
 