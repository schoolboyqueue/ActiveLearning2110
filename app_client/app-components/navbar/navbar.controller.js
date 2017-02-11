/* jshint node: true */

//************************************************************
//  navbar.controller.js                                    //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/13/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  13Jan17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Navbar.Controller', function($scope, $localStorage, $state, RESTService, UserService) {

    $scope.title = 'Active Learning 2110';

    $scope.logout = function() {
        RESTService.Logout();
    };

    $scope.profile = function() {
        UserService.ShowProfile();
    };

    $scope.$watch(function() {
        return $state.current.url;
    }, function(newVal, oldVal) {
        if (newVal !== undefined) {
            $scope.title = $state.current.url === '/' + $localStorage.role ?
                    'Active Learning 2110' : $localStorage.courses[$localStorage.selectedCourse].title;
        }
    });
});
