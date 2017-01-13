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

app.factory('UserService', function() {

    var user = {
        id: '',
        email: '',
        course_list: [],
        notifications: {
            count: 0,
            data: []
        },
    };

    user.Clear = function() {
        user.id = '';
        user.email = '';
        user.course_list = [];
        user.notifications.count = 0;
        user.notifications.data = [];
    };

    return user;
});
