// 引入必须模块
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var jsdom = require("jsdom");
var request = require('request');
const { JSDOM } = jsdom;
var item = new JSDOM(String);
var document = item.window.document;
//连接数据库
var mysql=require('mysql');
//var userName = document.getElementsByClassName('user-name')[0];

// 在线人数统计
var onlineCount = 0;
app.use(express.static(__dirname));

// 路径映射
app.get('/login.html', function (request, response) {
    response.sendFile('login.html');
});

// 当有用户连接进来时
io.on('connection', function (socket) {
    console.log('a user connected');
    //console.log(userName);
    var connection = mysql.createConnection({     
        host     : 'localhost',       
        user     : 'root',              
        password : 'woaibupt*=#1',       
        port: '3306',                   
        database: 'chatroom' 
    }); 
    connection.connect();
    var  addSql = 'INSERT INTO noob(username) VALUES(?)';
                var  addSqlParams =[ document.getElementsByClassName('user-name')[0]];
                connection.query(addSql,addSqlParams,function (err, result) {
                   if(err){
                          console.log(err.message);
                           return;
                            }        
                           console.log('插入数据succeed');
                             });
                             connection.end();
    

    // 发送给客户端在线人数
    io.emit('connected', ++onlineCount);

    // 当有用户断开
    socket.on('disconnect', function () {
        console.log('user disconnected');

        // 发送给客户端断在线人数
        io.emit('disconnected', --onlineCount);
        console.log(onlineCount);
    });

    // 收到了客户端发来的消息
    socket.on('message', function (message) {
        // 给客户端发送消息
        io.emit('message', message);
    });

});

var server = http.listen(4000, function () {
    console.log('Sever is running');
});
