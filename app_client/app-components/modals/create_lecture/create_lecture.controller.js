/* jshint node: true */

//************************************************************
//  create_course.controller.js                             //
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

app.controller('Create.Lecture.Controller', function($scope, $state, RESTService) {

    $scope.loading = false;
    $scope.error = null;

    $scope.course = {
        title: null,
        date: null,
    };
});
