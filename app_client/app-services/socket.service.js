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

app.factory('SocketService', function() {

    var service = {};
    var socket = null;

    service.connect = function(token, callback) {
        socket = io();
        socket.on('connect', function() {
                socket.emit('authenticate', {
                    token: token
                });
            })
            .on('authenticated', function() {
                callback(true);
            })
            .on('unauthorized', function() {
                callback(false);
            });
    };

    service.on = function(eventName, callback) {
        socket.on(eventName, callback);
    };

    service.emit = function(eventName, data) {
        socket.emit(eventName, data);
    };

    return service;

});
