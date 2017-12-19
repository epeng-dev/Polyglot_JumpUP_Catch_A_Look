var express = require('express');
var http = require('http');
var path = require('path');
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var web = require('./router/web.js');
 
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './view');

app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));

//---------------------------------------------------------------------------------------------

var httpServer =http.createServer(app).listen(process.env.PORT || 3000, function(){
  console.log('Socket IO server has been started');
});

var io = require('socket.io').listen(httpServer);

var roomList = {};
var userList = {};
var ownerList = {};
var waitGameList = {}; 

var roomId = 1;

app.post('/api/roomlist', function(req, res){
    res.send(roomList);
});

app.get('/client', function(req, res){
    var roomID = req.query.roomId;
    console.log("userList: ", userList[roomID]);
    res.render('client', {"roomId": roomID, "userList": userList[roomID]});
});
 
app.get('/owner', function(req, res) {
    res.render('owner', {owner:req.query.owner, title: req.query.title, roomId: req.query.roomId});
    console.log("roomId", req.query.roomId);
});


io.sockets.on('connection',function(socket){
    var rooms = io.sockets.adapter.rooms;

    console.log('connect!');

    socket.emit('firstConn', {"list": roomList, "userList": userList});

    socket.on('waitFromClient',function(data) {
        socket.emit('waitToClient', {who: data.who, msg: data.msg});
        socket.broadcast.emit('waitToClient', {who: data.who, msg: data.msg});
    });

    socket.on('standFromClient', function(data) {
        console.log("roomId: ", roomList[data.roomId].socketId);
        io.sockets.in(roomList[data.roomId].socketId).emit('standToClient', {who: data.who, msg: data.msg});
    });

    socket.on('makeRoom', function(data) {
        console.log("makeRoom roomId", roomId);
        console.log("makeRoom title", data.title);
        roomList[roomId] = {
            "title": data.title,
            "owner": data.owner,
            "roomId": roomId,
            "wait": true,
            "answer": data.answer,
            "socketId": undefined
        }

        socket.emit('gotoOwner', {"title": data.title, "owner": data.owner, "roomId": roomId});
        console.log("roomId: ", roomId);
        console.log("roomList: ", roomList);

        roomId++;
    });

    socket.on('joinRoom', function(data) {
        console.log("joinRoom id: ", data.roomId);
        socket.emit('gotoClient', {"roomId":data.roomId});
    });

    socket.on('clientConn', function(data) {
        userList[data.roomId].player.push(socket.id);
        waitGameList[socket.id]=data.roomId;
        socket.join(roomList[data.roomId].socketId);
        userList[data.roomId].playerLen++;

        io.sockets.in(roomList[data.roomId].socketId).emit('newMember', {socketId: socket.id});
        socket.broadcast.emit('addPlayer', {"length": userList[data.roomId].playerLen+1, "socketId": socket.id});

        console.log("length: ", userList[data.roomId].playerLen);
    });

    socket.on('ownerConn', function(data) {
        var ownerRoomId = data.roomId;
        console.log("roomId", ownerRoomId);
        
        var title = roomList[ownerRoomId].title;
        var owner = roomList[ownerRoomId].owner;
        roomList[ownerRoomId].socketId = socket.id;
        waitGameList[socket.id]=1;

        userList[ownerRoomId] = {
            "title": title,
            "owner": socket.id,
            "player": [],
            "playerLen": 0
        }
        console.log("socketId: ", socket.id);

        if(title != undefined) {
            socket.broadcast.emit('madeRoom', {"newRoom": roomList[ownerRoomId], "roomId": ownerRoomId});
        }
    });

    socket.on('gameStart', function(data) {
        console.log("gameStart!");
        roomList[data.roomId].wait = false;

        socket.emit('finishRoom', {roomId: data.roomId});
        socket.broadcast.emit('finishRoom', {roomId: data.roomId});
    });

    socket.on('addOwner', function(data) {
        ownerList[socket.id] = data.roomId;
    });

    socket.on('gone', function(data) {
        socket.leave(data.socketId);
    });
  
    socket.on('disconnect', function() {
        console.log('disconnect');
        var disRoomId = ownerList[socket.id];

        if(disRoomId != undefined) { //방장이 나갈때
            roomList[disRoomId] = undefined;
            userList[disRoomId] = undefined;
            ownerList[socket.id] = undefined;

            console.log("kick");
            socket.broadcast.emit('kick', {socketId: socket.id});
        } else {
            if(waitGameList[socket.id] != undefined) { 
                var roomID = waitGameList[socket.id];
                var gamePlayer = userList[roomID];

                if(gamePlayer == undefined)
                    return;

                for(var i=0; i<gamePlayer.playerLen; i++) {
                    if (userList[roomID].player[i] == socket.id) {
                        delete userList[roomID].player[i];
                        userList[roomID].playerLen--;
                    }
                }
                console.log("player ", gamePlayer.player);
                console.log("userDis", userList[roomID].playerLen);

                waitGameList[socket.id]=undefined;
                socket.broadcast.emit('userDis', {"socketId": socket.id, "length": userList[roomID].playerLen+1});
            }
        }
    });
});