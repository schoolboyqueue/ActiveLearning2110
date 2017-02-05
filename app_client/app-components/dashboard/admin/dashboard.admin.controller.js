/* jshint node: true */

//************************************************************
//  dashboard.admin.controller.js                           //
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

app.controller('Admin.Dashboard.Controller', function($scope, $localStorage, $state, UserService) {

    $scope.sortType = 'firstname';
    $scope.sortReverse = false;
    $scope.searchUsers = '';

    $scope.changes = {};

    $scope.roles = [{
        id: "1",
        name: "instructor"
    }, {
        id: "2",
        name: "student"
    }, {
        id: "3",
        name: "admin"
    }];

});

app.filter('activation', function() {
    return function(deactivated) {
        if (!deactivated) {
            return 'Deactivate';
        } else {
            return 'Activate';
        }
    };
});
