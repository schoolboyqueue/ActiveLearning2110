/* jshint node: true */

//************************************************************
//  dashboard.instructor.controller.js                      //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 02/03/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  03Feb17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Instructor.Dashboard.Controller', function($scope, $localStorage, UserService) {

    $scope.coursesUserCount = {};

    $scope.createCourse = function() {
        UserService.ShowCreateCourse();
    };

    $scope.getUserCount = function(course) {
        var count = 0;
        for (var key in course.sections) {
            count += course.sections[key].students.length;
        }
        $scope.coursesUserCount[course.id] = count;
    };

});
