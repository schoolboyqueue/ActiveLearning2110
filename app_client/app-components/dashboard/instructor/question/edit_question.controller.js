/* jshint node: true */

//************************************************************
//  edit_question.controller.js                             //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 03/18/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  18Mar17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Instructor.Edit.Question.Controller', function($scope, $state, $localStorage, RESTService, ngNotify, NgTableParams) {

    $scope.questions = null;

    $scope.tableParams = new NgTableParams({
        count: 6,
        sorting: {
            copied: "asc"
        }
    }, {
        counts: [5, 10, 15],
        dataset: $scope.questions
    });

    RESTService.GetAllQuestions(function(info) {
        if (!info.success) {
            ngNotify.set('Could not fetch questions', 'error');
            return;
        }
        $scope.questions = info.questions;
        $scope.tableParams.settings().dataset = info.questions;
        $scope.tableParams.reload();
    });
});
