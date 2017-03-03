/* jshint node: true */

//************************************************************
//  lecture.controller.js                                   //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 02/27/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  27Feb17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Instructor.Lecture.Edit.Controller', function($scope, $localStorage, $stateParams, $rootScope) {

    $rootScope.$stateParams = $stateParams;
    $scope.lecture = $localStorage.courses[$stateParams.selectedCourse].lectures[$stateParams.selectedLecture];

});
