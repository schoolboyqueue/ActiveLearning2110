/* jshint node: true */

//************************************************************
//  live_lecture.controller.js                             //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 02/03/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  07Apr17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Student.Live.Lecture.Controller', function($scope, $localStorage, $rootScope, $stateParams, $state, UserService, SocketService, ngNotify) {
    $scope.time = 10;
    $scope.timeMax = 20;
    $scope.timerEnabled = false;
    $rootScope.$stateParams = $stateParams;
    var course = $localStorage.courses[$stateParams.selectedCourse];
    var lidx = $stateParams.selectedLecture;

    $rootScope.$on('coursesUpdated', function() {
        if ($stateParams.selectedCourse !== null && $state.current.name === 'main.student_live_lecture') {
            course = $localStorage.courses[$stateParams.selectedCourse];
            if (!course.lectures[lidx].live) {
                ngNotify.set('Live lecture has ended', 'info');
                $state.go('main.student');
            }
        }
    });

    $rootScope.$on('newQuestion', function(evt, info) {
        $scope.$apply(function() {
            $scope.title = info.question.html_title;
            $scope.body = info.question.html_body;
            $scope.choices = info.question.answer_choices;
            $scope.timerEnabled = true;
            var myTime = new Date();
            var endTime = new Date(info.end_time);
            $scope.time = Math.round(Math.abs((myTime - endTime) / 1000));
            $scope.timeMax = info.max_time;
            $scope.$broadcast('timer-set-countdown-seconds', $scope.time);
            $scope.$broadcast('timer-start');
        });
    });

    $scope.$on('timer-tick', function(event, data) {
        $scope.time = data.millis / 1000;
        if ($scope.time === 0) {
            $scope.timerEnabled = false;
        } else {
            $scope.timerEnabled = true;
        }
    });
});
