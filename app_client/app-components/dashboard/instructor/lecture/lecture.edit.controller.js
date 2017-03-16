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

    $scope.questions = null;
    $scope.selectedQuestion = null;

    $rootScope.$stateParams = $stateParams;
    $scope.lecture = $localStorage.courses[$stateParams.selectedCourse].lectures[$stateParams.selectedLecture];

    $scope.lectureQuestions = [{title:"asdf"}];

    $scope.questions = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.nonword(
            "tags", "title"
        ),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            wildcard: '%QUERY',
            url: 'api_v2/question?tag=%QUERY',
            filter: function(response) {
                return response.questions;
            }
        }
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

    $scope.addQuestion = function() {
        $scope.lectureQuestions.push($scope.selectedQuestion);
        $scope.selectedQuestion = null;
    };

    $scope.removeQuestion = function(index) {
        $scope.lectureQuestions.splice(index, 1);
    };

    $scope.checkSelectedQuestion = function() {
        if ($scope.selectedQuestion === null || !('_id' in $scope.selectedQuestion)) {
            return true;
        }
        for (var key in $scope.lectureQuestions) {
            if ($scope.lectureQuestions[key]._id === $scope.selectedQuestion._id) {
                return true;
            }
        }
        return false;
    };
});
