/* jshint node: true */

//************************************************************
//  splash.controller.js                                    //
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

app.controller('Splash.Controller', function($scope, UserService) {

    $scope.login = function() {
        UserService.ShowLogin();
    };

});
