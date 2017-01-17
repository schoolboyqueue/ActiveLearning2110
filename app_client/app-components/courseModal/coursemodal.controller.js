/* jshint node: true */

//************************************************************
//  coursemodal.controller.js                               //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/15/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  15Jan17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('CourseModal.Controller', function($scope, $element, $localStorage, UserService) {

        $scope.course = null;
        $scope.error = null;

        if ($localStorage.role === 'student') {
            $scope.btnTitle = 'Join';
            $scope.title = 'Register for Course';
            $scope.placeholder = 'Course Key';
        } else {
            $scope.title = 'Create Course';
            $scope.placeholder = 'Course Name';
            $scope.btnTitle = 'Create';
        }

        var handleStatus = function(error, text) {
            console.log(error + ' : ' + text);
        };

        $scope.jnCreate = function() {
            if ($localStorage.role === 'student') {
                console.log('student');
            } else {
                UserService.CreateCourse($scope.course, createPost);
            }
        };

        function createPost(result, status, text) {
            if (!result) {
                handleStatus(status, text);
                return;
            }
            $element.modal('hide');
        }
    }
);
