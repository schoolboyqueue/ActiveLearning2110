/* jshint node: true */

//************************************************************
//  question_preview.controller.js                          //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 03/17/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  17Mar17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Question.Preview.Controller', function($scope, $element, title, body, tags, choices) {

    $scope.title = title;
    $scope.body = body;
    $scope.choices = choices;
    $scope.tags = tags;

});
