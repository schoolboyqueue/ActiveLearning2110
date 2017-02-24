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

app.factory('SocketService', function($rootScope) {

    var service = {};
    var socket = null;

    service.connect = function(id) {
        socket = io.connect('http://localhost:8082', {
            query: 'id=' +  id,
        });
        socket.on('notification', function(data) {
            console.log(data);
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
