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
//                                                          //
//************************************************************

var app = angular.module('app');

app.factory('UserService', function($http, $localStorage) {

    var service = {};

    service.getUserInfo = function(callback) {
        $http.post('/api_v2/user/' + $localStorage.id)
            .then(function (response) {
                $localStorage.id = response.data.user._id;
                $localStorage.email = response.data.user.username;
                $localStorage.photo = response.data.user.photo;
                $localStorage.role = response.data.user.role;
                callback(true, response.status, response.data.message);
            },
            function(response) {
                callback(false, response.status, response.data.message);
            }
        );
    };

    service.Clear = function() {
        $localStorage.$reset();
    };

    return service;
});
