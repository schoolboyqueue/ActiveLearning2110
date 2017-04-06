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
    app_support = require('./app_support'),
    bodyparser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    sessions = require('client-sessions'),
    config = require('./config'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    live_lectures = [];

require('./app_socket/lectures')(io, live_lectures);

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

app_client(app);
app_api_v2(app);
app_support(app);

app.set('port', process.env.PORT || 8081);

server.listen(app.get('port'), function() {
    console.log('listening on port 8081');
});
