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
    var socket = io('http://localhost:8081/lectures_list');

    socket.on('connect', function() {
        console.log('lecture socket connected');
    });
    socket.on('lectures_update', function(lecture_ids) {
        console.log(lecture_ids);
        UserStorage.LectureLiveUpdate(lecture_ids);
    });
    socket.on('disconnect', function(reason) {
        console.log('lecture socket disconnected ' + reason);
    });

    service.StartLecture = function(id) {
        socket.emit('start_lecture', id);
    };

    service.StopLecture = function(id) {
        socket.emit('end_lecture', id);
    };

    return service;

});
