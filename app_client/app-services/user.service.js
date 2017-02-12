/* jshint node: true */

//************************************************************
//  user.service.js                                         //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/12/17.                   //
//  Copyright © 2016 Odell Mizrahi. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  12Jan17     J. Carter  Initial Design                   //
//  15Jan17     J. Carter  Moved in ShowLogin & created     //
//                          ShowACCourse                    //
//************************************************************
var app = angular.module('app');

app.factory('UserService', function($state, $localStorage, ModalService) {

    var service = {};

    service.ShowLogin = function() {
        ModalService.showModal({
            templateUrl: '/app-components/modals/login/login.view.html',
            controller: 'Login.Controller'
        }).then(function(modal) {
            modal.element.modal({
                backdrop: 'static',
                keyboard: false
            });
            modal.close.then(function(result) {
                if (result) {
                    $('.modal-backdrop').remove();
                    $state.go('main.' + $localStorage.role);
                }
            });
        });
    };

    service.ShowProfile = function() {
        ModalService.showModal({
            templateUrl: '/app-components/modals/profile/profile.view.html',
            controller: 'Profile.Controller'
        }).then(function(modal) {
            modal.element.modal();
        });
    };

    service.ShowJoinCourse = function() {
        ModalService.showModal({
            templateUrl: '/app-components/modals/join_course/join_course.view.html',
            controller: 'JoinCourse.Controller'
        }).then(function(modal) {
            modal.element.modal();
        });
    };

    service.ShowCreateCourse = function() {
        ModalService.showModal({
            templateUrl: '/app-components/modals/create_course/create_course.view.html',
            controller: 'CreateCourse.Controller'
        }).then(function(modal) {
            modal.element.modal();
        });
    };

    return service;
});

app.directive("picread", [function() {
    return {
        scope: {
            picread: "="
        },
        link: function(scope, element, attributes) {
            element.on("change", function(changeEvent) {
                var reader = new FileReader();
                reader.onload = function(loadEvent) {
                    scope.$apply(function() {
                        scope.picread = loadEvent.target.result;
                        element.val(null);
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.on("change", function (changeEvent) {
                scope.$apply(function () {
                    scope.fileread = changeEvent.target.files[0];
                });
            });
        }
    };
}]);

app.filter('days', function () {
    return function (str) {
        return str.includes("mon") ? "MWF": "TR";
    };
});

app.filter('offset', function() {
    return function(input, start) {
    	return input.slice(start);
 	};
});
