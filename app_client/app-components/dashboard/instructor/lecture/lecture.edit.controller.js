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

app.controller('Instructor.Lecture.Edit.Controller', function($scope, $localStorage, $stateParams, $rootScope, $timeout, RESTService) {

    $scope.loaded = false;
    $scope.questions = null;

    $rootScope.$stateParams = $stateParams;
    $scope.lecture = $localStorage.courses[$stateParams.selectedCourse].lectures[$stateParams.selectedLecture];

    $scope.questions = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.nonword(
            "tags", "title"
        ),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: []
    });

    $scope.questions.initialize();

    $scope.questionsDataset = {
        displayKey: 'title',
        source: $scope.questions.ttAdapter(),
        templates: {
            empty: [
                '<div class="tt-suggestion tt-empty-message">',
                'No results were found',
                '</div>'
            ].join('\n'),
            suggestion: function(data) {
                return '<p class="m-0">' + data.title + '<br><span class="badge badge-default mr-1 text-uppercase">' + data.tags + '</span></br></p>';
            }
        }
    };
    RESTService.GetAllQuestions(function(info) {
        $scope.loaded = true;
        $scope.questions.add(info.questions);
    });
});
