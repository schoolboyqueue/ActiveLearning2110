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

app.factory('SocketService', function(UserStorage) {

    var service = {};
    var socket = null;
    var lectureList_Socket = null;

    service.connect = function(token, callback) {
        socket = io();
        socket.on('connect', function() {
                console.log('main socket connected');
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
        socket.on('disconnect', function() {
            console.log('main socket disconnect');
        });
    };

    service.connectLectures = function() {
        lectureList_Socket = io.connect('/lectures_list');
        lectureList_Socket.on('connect', function() {
            console.log('lecture socket connected');
        });
        lectureList_Socket.on('lectures_update', function(lecture_ids) {
            console.log(lecture_ids);
            UserStorage.LectureLiveUpdate(lecture_ids);
        });
        lectureList_Socket.on('disconnect', function() {
            console.log('lecture socket disconnected');
        });
    };

    service.startLecture = function(id) {
        lectureList_Socket.emit('start_lecture', id);
    };

    service.on = function(eventName, callback) {
        socket.on(eventName, callback);
    };

    service.emit = function(eventName, data) {
        socket.emit(eventName, data);
    };

    return service;

});
