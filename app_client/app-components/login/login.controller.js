/* jshint node: true */

//************************************************************
//  login.controller.js                                     //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/11/17.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  11Jan17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Login.Controller', [
    '$scope',
    '$element',
    'AuthenticationService',
    'close',
    function($scope, $element, AuthenticationService, close) {
        $scope.title = 'Login';
        $scope.email = null;
        $scope.password = null;
        $scope.passwordVerify = null;
        $scope.professorKey = null;
        $scope.error = null;
        $scope.loading = false;
        $scope.register = false;
        $scope.professor = false;

        initController();

        function initController() {
            // reset login status
            AuthenticationService.Logout();
        }

        $scope.startRegister = function() {
            $scope.error = null;
            $scope.title = $scope.title === 'Login' ? 'Register' : 'Login';
            $scope.register = !$scope.register;
        };

        $scope.professorClick = function() {
            $scope.error = null;
            $scope.professor = !$scope.professor;
        };

        var handleStatus = function(error, text) {
            console.log(error);
            switch (error) {
                case 200:
                    $scope.error = null;
                    break;
                case 400:
                    $scope.error = text;
                    $scope.professorKey = null;
                    break;
                case 401:
                case 404:
                    $scope.error = text;
                    break;
                case 500:
                    $scope.error = 'Username taken';
                    $scope.email = null;
                    break;
            }
        };

        $scope.submit = function() {
            $scope.loading = true;
            if ($scope.register) {
                AuthenticationService.Register(
                    $scope.email,
                    $scope.password,
                    $scope.professor,
                    $scope.professorKey,
                    function(result, status, text) {
                        if (result === true) {
                            $scope.startRegister();
                            handleStatus(status, text);
                        } else {
                            handleStatus(status, text);
                        }
                        $scope.loading = false;
                });
            } else {
                AuthenticationService.Login($scope.email, $scope.password, function(result, status, text) {
                    if (result === true) {
                        $element.modal('hide');
                        handleStatus(status, text);
                    } else {
                        handleStatus(status, text);
                    }
                    $scope.loading = false;
                });
            }
        };
    }
]);

app.directive('gatech', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                var valid = false;
                if (value) {
                    valid = value.toLowerCase().includes('@gatech.edu');
                    ctrl.$setValidity('invalidGatech', valid);
                }
                return valid ? value : undefined;
            });
        }
    };
});

app.directive('verifypass', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(value) {
                var valid = false;
                if (value) {
                    valid = value === scope.password;
                    ctrl.$setValidity('invalidEqPass', valid);
                }
                return valid ? value : undefined;
            });
        }
    };
});
