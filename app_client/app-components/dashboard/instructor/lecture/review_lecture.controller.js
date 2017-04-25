/* jshint node: true */

//************************************************************
//  live_lecture.controller.js                              //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 04/02/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  02Apr17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Instructor.Review.Lecture.Controller', function($scope, $localStorage, $state, $stateParams, $rootScope, RESTService) {
    $rootScope.$stateParams = $stateParams;
    $scope.lecture_id = $stateParams.selectedLectureId;

});
