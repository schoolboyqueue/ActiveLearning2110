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

app.factory('SocketService', function($rootScope, UserStorage) {

    var service = {};
    var lectureList_socket = io('http://localhost:8081/lectures_list');
    var liveLecture_socket = null;

    lectureList_socket.on('connect', function() {
        console.log('lecture lectureList_socket connected');
    });
    lectureList_socket.on('lectures_update', function(lecture_ids) {
        console.log(lecture_ids);
        UserStorage.LectureLiveUpdate(lecture_ids);
    });
    lectureList_socket.on('disconnect', function(reason) {
        console.log('lecture lectureList_socket disconnected ' + reason);
    });

    service.JoinLiveLecture = function(info) {
        liveLecture_socket = io('http://localhost:8081/live_lecture');
        liveLecture_socket.on('connect', function() {
            console.log('live lecture connected');
            buildLiveLectureEvents();
            liveLecture_socket.emit('join_lecture', {
                username: info.username,
                user_id: info.user_id,
                user_role: info.user_role,
                lecture_id: info.lecture_id
            });
        });
    };

    service.StartQuestion = function(question_id) {
        liveLecture_socket.emit('newQuestion', question_id);
    };

    service.StartLecture = function(info) {
        lectureList_socket.emit('start_lecture', info.lecture_id);
        service.JoinLiveLecture(info);
    };

    service.StopLecture = function(id) {
        lectureList_socket.emit('end_lecture', id);
    };

    function buildLiveLectureEvents() {
        console.log('building socket events');
        liveLecture_socket.on('questionFeed', function(data) {
            $rootScope.$emit('newQuestion', data);
        });
        liveLecture_socket.on('updatedUserTotal', function(data) {
            console.log('user list: ' + data);
        });
    }

    return service;

});
