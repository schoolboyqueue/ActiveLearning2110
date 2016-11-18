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
//************************************************************
"use strict";

var app_api    = require('./app_api'),
    app_client = require('./app_client'),
    bodyparser = require('body-parser'),
    express    = require('express'),
    mongoose   = require('mongoose'),
    path       = require('path'),
    sass       = require('node-sass-middleware'),
    sessions   = require('client-sessions'),
    config     = require('./config'),
    app        = express();

/**
Must have MongoDB installed and run mongod
*/
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/ActiveLearning2110');
mongoose.connect(config.database);

app.use(sass({
        src: path.join(__dirname, '/app_client/scss'),
        dest: path.join(__dirname, '/app_client'),
        debug: false,
        outputStyle: 'compressed'
    }),
    express.static(path.join(__dirname, '/app_client'))
);

app.set('views', path.join(__dirname, '/app_client/views'));
app.set('view engine', 'pug');

app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());

app.use(sessions({
    cookieName: 'session',
    secret: config.secret,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app_api(app);
app_client(app);


/**
Binds and listens for connections on the specified host and port

- parameter PORT:       8081
- parameter HANDLER:    callback
**/
app.listen(process.env.PORT || 8081, function() {
    console.log('listening on port 8081');
});
