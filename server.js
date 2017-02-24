/* jshint node: true */

//************************************************************
//  server.js                                               //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Odell Mizrahi on 9/13/16.                    //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  13Sep16     O. Mizrahi  Initial Design                  //
//  08Oct16     J. Carter   Added Sass Support              //
//  16Nov16     J. Carter   Added urlencoded to bodyparser  //
//  12Jan17     J. Carter   Removed unused libraries        //
//************************************************************
"use strict";

var app_api_v2 = require('./app_api_v2'),
    app_client = require('./app_client'),
    bodyparser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    sessions = require('client-sessions'),
    config = require('./config'),
    app = express(),
    socket_serv = require('http').createServer(app),
    io = require('socket.io').listen(socket_serv),
    client_db = {
        admins: {},
        instructors: {},
        students: {}
    };

/**
Must have MongoDB installed and run mongod
*/
mongoose.Promise = global.Promise;
mongoose.connect(config.database);

app.use(express.static(path.join(__dirname, '/app_client')));

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(cookieParser());

app.use(bodyparser.json());

app.use(sessions({
    cookieName: 'session',
    secret: config.session_secret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app_client(app);
app_api_v2(app);

socket_serv.listen(8082, function() {
    console.log("Socket.Io Server listening on port 8082");
});

io.on('connection', function(socket) {
    console.log('SOCKET.IO CONNECTION');

    socket.on('test', function(message) {
        console.log('TEST');
        io.emit('notification', {
            message: message
        });
    });
});

io.use(function(socket, next) {
    console.log("Query: ", socket.handshake.query);
    // return the result of next() to accept the connection.
    client_db[socket.handshake.query.id] = socket;
    next();
    // call next() with an Error if you need to reject the connection.
    //next(new Error('Authentication error'));
});

/**
Binds and listens for connections on the specified host and port

- parameter PORT:       8081
- parameter HANDLER:    callback
**/
app.listen(process.env.PORT || 8081, function() {
    console.log('listening on port 8081');
});
