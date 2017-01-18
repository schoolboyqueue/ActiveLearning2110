/* jshint node: true */

//************************************************************
//  profile.controller.js                                   //
//  Active Learning 2110                                    //
//                                                          //
//  Created by Jeremy Carter on 01/15/17.                   //
//  Copyright © 2016 Jeremy Carter. All rights reserved.    //
//                                                          //
//  Date        Name        Description                     //
//  -------     ---------   --------------                  //
//  15Jan17     J. Carter  Initial Design                   //
//                                                          //
//************************************************************

var app = angular.module('app');

app.controller('Profile.Controller', function($scope, $element, $localStorage) {
        $scope.edit = false;
        $scope.title = 'Profile';
        $scope.email = $localStorage.email;
        $scope.role = $localStorage.role;
        $scope.courses = $localStorage.courses;
        $scope.photo = $localStorage.photo;
    }
);
