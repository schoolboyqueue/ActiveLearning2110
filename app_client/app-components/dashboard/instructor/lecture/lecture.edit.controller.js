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

app.controller('Instructor.Lecture.Edit.Controller', function($scope, $localStorage, $stateParams, $rootScope, RESTService, UserService, ngNotify) {

    $scope.addLoading = false;
    $scope.removeLoading = false;
    $scope.questions = null;
    $scope.selectedQuestion = {};
    $scope.selectedQuestionSet = {};

    $rootScope.$stateParams = $stateParams;
    $scope.course = $localStorage.courses[$stateParams.selectedCourse];
    updateLectureInfo();

    RESTService.GetLectureInfo({
        lecture_id: $scope.lecture.lecture_id,
        course_id: $scope.course._id
    }, function(info) {
        if (!info.success) {
            ngNotify.set('Could not fetch lecture info', 'error');
            return;
        }
        $scope.lecture = $scope.course.lectures[$stateParams.selectedLecture];
    });

    $scope.options = [{
        title: 'All Questions',
        type: 'all'
    }, {
        title: 'Question Sets',
        type: 'sets'
    }];

    $scope.searchType = $scope.options[0];

    $scope.questions = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.nonword(
            "tags", "title"
        ),
        queryTokenizer: Bloodhound.tokenizers.nonword,
        remote: {
            wildcard: '%QUERY',
            url: 'api_v2/question?tag=%QUERY',
            filter: function(response) {
                return response.questions;
            }
        }
    });

    $scope.sets = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.whitespace(
            "title"
        ),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        remote: {
            cache: false,
            url: 'api_v2/user/' + $localStorage._id + '/questionsets',
            filter: function(response) {
                return response.questionsets;
            }
        }

    });

    $scope.questionSetsDataset = {
        displayKey: 'title',
        source: $scope.sets.ttAdapter(),
        templates: {
            empty: [
                '<div class="tt-suggestion tt-empty-message">',
                'No results were found',
                '</div>'
            ].join('\n'),
            suggestion: function(data) {
                return '<p class="m-0">' + data.title + '</p>';
            }
        }
    };

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

    $scope.questions.initialize();
    $scope.sets.initialize();

    $scope.addQuestion = function() {
        $scope.addLoading = true;
        RESTService.AddQuestionToLecture({
            question_id: $scope.selectedQuestion._id,
            lecture_id: $scope.lecture.lecture_id,
            course_id: $scope.course._id
        }, finishAddQuestionToLecture);
    };

    $scope.removeQuestion = function(index) {
        $scope.removeLoading = true;
        RESTService.RemoveQuestionFromLecture({
            question_id: $scope.lecture.questions[index].question_id,
            lecture_id: $scope.lecture.lecture_id,
            course_id: $scope.course._id
        }, finishRemoveQuestionFromLecture);
    };

    $scope.viewQuestion = function(index) {
        RESTService.GetQuestionDetails($scope.lecture.questions[index].question_id, function(info) {
            if (!info.success) {
                ngNotify.set('Could not fetch question details', 'error');
                return;
            }
            UserService.ShowQuestionPreview(info);
        });
    };

    $scope.createQuestionSet = function() {
        RESTService.CreateQuestionSet({
            title: $scope.setName.toLowerCase(),
            lecture_id: $scope.lecture.lecture_id
        }, finishCreateQuestionSet);
    };

    $scope.checkSelectedQuestion = function() {
        if (!$scope.selectedQuestion.hasOwnProperty('_id') || $scope.addLoading || $scope.removeLoading) {
            return true;
        }
        for (var key in $scope.lecture.questions) {
            if ($scope.lecture.questions[key].question_id === $scope.selectedQuestion._id) {
                return true;
            }
        }
        return false;
    };

    $scope.checkSelectedQuestionSet = function() {
        if (!$scope.selectedQuestionSet.hasOwnProperty('_id') || $scope.addLoading || $scope.removeLoading) {
            return true;
        }
        return false;
    };

    $scope.addQuestionSet = function() {
        $scope.addLoading = true;
        RESTService.AddQuestionSetToLecture({
            lecture_id: $scope.lecture.lecture_id,
            course_id: $scope.course._id,
            questionset_id: $scope.selectedQuestionSet._id
        }, finishAddQuestionToLecture);
    };

    var beforeSortItems;

    $scope.sortableOptions = {
        start: function() {
            beforeSortItems = $scope.lecture.questions.slice();
        },
        stop: function(e, ui) {
            RESTService.MoveLectureQuestion({
                lecture_id: $scope.lecture.lecture_id,
                question_id: $scope.lecture.questions[ui.item.index()].question_id,
                index: ui.item.index()
            }, function(info) {
                if (!info.success) {
                    $scope.lecture.questions = beforeSortItems;
                    ngNotify.set('Error moving question', 'error');
                }
            });
        }
    };

    function updateLectureInfo() {
        $scope.lecture = $scope.course.lectures[$stateParams.selectedLecture];
        $scope.questions = $scope.lecture.questions;
    }

    function finishCreateQuestionSet(info) {
        if (!info.success) {
            ngNotify.set('Error creating question set', 'error');
            return;
        }
        ngNotify.set('Question set created', 'success');
        $scope.setName = null;
        $scope.saveSet = false;
    }

    function finishAddQuestionToLecture(info) {
        if (!info.success) {
            ngNotify.set('Error adding question to lecture', 'error');
            return;
        }
        updateLectureInfo();
        $scope.selectedQuestion = {};
        $scope.selectedQuestionSet = {};
        $scope.addLoading = false;
    }

    function finishRemoveQuestionFromLecture(info) {
        if (!info.success) {
            ngNotify.set('Error removing question from lecture', 'error');
            return;
        }
        updateLectureInfo();
        $scope.removeLoading = false;
    }
});
