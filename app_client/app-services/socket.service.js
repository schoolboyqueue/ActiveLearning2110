/* jshint node: true */

//************************************************************
//  socket.service.js                                       //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/12/17.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  20Feb17     J. Carter  Initial Design                   //
//************************************************************
var app = angular.module('app');

app.factory('SocketService', function($localStorage) {

    var service = {};
    var socket = io();

    socket.on('connect', function(msg) {
        console.log('connected');
        socket.emit('authenticate', {
            token: $localStorage.jwt_token
        });
    })
    .on('authenticated', function() {
        console.log('YAYYYYYYY!');
    });

    service.connect = function(token) {
        socket.connect('http://localhost:8081');
    };

    service.on = function(eventName, callback) {
        socket.on(eventName, callback);
    };

    service.emit = function(eventName, data) {
        socket.emit(eventName, data);
    };

    return service;

});
