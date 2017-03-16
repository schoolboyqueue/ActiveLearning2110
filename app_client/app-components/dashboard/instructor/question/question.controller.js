/* jshint node: true */

//************************************************************
//  course.student.controller.js                            //
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

app.controller('Instructor.Question.Controller', function($scope, $state, $rootScope, $localStorage, RESTService, ngNotify) {

    $scope.state = 'edit';
    $scope.editor = null;

    $scope.question = {
        html: {
            title: null,
            titleText: null,
            body: null
        },
        trueFalse: true,
        tags: [],
        choices: [{
            id: 1,
            text: "True",
            answer: true
        }, {
            id: 2,
            text: "False",
            answer: false
        }]
    };

    $scope.setChoicesTrueFalse = function() {
        if ($scope.question.trueFalse === true) {
            $scope.question.choices = [{
                id: 1,
                text: "True",
                answer: true
            }, {
                id: 2,
                text: "False",
                answer: false
            }];
        } else {
            $scope.question.choices = [{
                id: 1,
                text: "",
                answer: true
            }];
        }
    };

    $scope.answersEmpty = function() {
        var empty = false;
        for (var i in $scope.question.choices) {
            if ($scope.question.choices[i].text === '') {
                return true;
            }
        }
        return empty;
    };

    $scope.addNewChoice = function() {
        var newItemNo = $scope.question.choices.length + 1;
        $scope.question.choices.push({
            id: newItemNo,
            text: "",
            answer: false
        });
    };

    $scope.answerSelected = function(index) {
        $scope.question.choices[index].answer = true;
        for (var i in $scope.question.choices) {
            if (i != index) {
                $scope.question.choices[i].answer = false;
            }
        }
    };

    $scope.removeChoice = function(index) {
        if ($scope.question.choices[index].answer === true) {
            $scope.question.choices.splice(index, 1);
            $scope.question.choices[0].answer = true;
        } else {
            $scope.question.choices.splice(index, 1);
        }
        if ($scope.question.choices.length == 1) {
            $scope.question.choices[0].answer = true;
        }
    };

    $scope.edit = function() {
        $scope.editor.start();
    };

    $scope.save = function() {
        $scope.editor.stop(true);
    };

    $scope.submit = function() {
        var tags = [];
        for (var key in $scope.question.tags) {
            tags.push($scope.question.tags[key].text);
        }
        var choices = [];
        for (key in $scope.question.choices) {
            choices.push({
                text: $scope.question.choices[key].text,
                answer: $scope.question.choices[key].answer
            });
        }
        RESTService.CreateQuestion({
            title: $scope.question.html.titleText,
            tags: tags,
            html_title: $scope.question.html.title,
            html_body: $scope.question.html.body,
            answer_choices: $scope.question.choices
        }, finishCreateQuestion);
    };

    $scope.cancel = function() {
        $scope.editor.stop(false);
    };

    $rootScope.$on('$stateChangeStart', function() {
        if ($scope.editor.isEditing()) {
            $scope.editor.stop(false);
        }
    });

    function finishCreateQuestion(response) {
        if (!response.success) {
            ngNotify.set('Question creation failed: ' + response.message, 'error');
            return;
        }
        ngNotify.set('Question created', 'success');
        $state.go('main.' + $localStorage.role);
    }
});
