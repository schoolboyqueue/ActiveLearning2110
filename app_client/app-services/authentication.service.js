/* jshint node: true */

//************************************************************
//  authenticaton.service.js                                //
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

app.factory('AuthenticationService', function($http, $localStorage, UserService, jwtHelper) {

    var service = {};

    service.Login = function(email, password, callback) {

        $http.post('/api_v2/authenticate', {
            username: email,
            password: password
        }).then(function (response) {
                    if (response.data.jwt_token) {
                        $localStorage.currentUser = {
                            username: email,
                            token: response.data.jwt_token,
                            id: response.data.user_id
                        };

                        UserService.id = response.data.user_id;
                        UserService.email = email;

                        $http.defaults.headers.common.Authorization = response.data.jwt_token;
                        callback(true, response.status, response.data.message);
                    } else {
                        callback(false, response.status, response.data.message);
                    }
                },
                function(response) {
                    callback(false, response.status, response.data.message);
                }
            );
    };

    service.Register = function(email, password, professor, key, callback) {
        var role = professor ? 'instructor' : undefined;
        var addr = role === 'instructor' ? '/api_v2/signup?role=' + role : '/api_v2/signup/';
        $http.post(addr, {
            username: email,
            password: password, key: key
        }).then(function (response) {
                    callback(true, response.status, response.data.message);
                },
                function (response) {
                    callback(false, response.status, response.data.message);
                }
            );
    };

    service.Expired = function(token) {
        return jwtHelper.isTokenExpired(token);
    };

    service.Logout = function(request) {
        if (request) {
            $http.delete('/api_v2/authenticate')
                .then(function() {

                },
                function() {

                });
        }
        delete $localStorage.currentUser;
        $http.defaults.headers.common.Authorization = '';
        UserService.Clear();
    };

    return service;
});
