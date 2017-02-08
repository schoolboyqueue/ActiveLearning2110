/* jshint node: true */

//************************************************************
//  create_course.controller.js                             //
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

app.controller('CreateCourse.Controller', function($scope, $localStorage, $state, UserService) {

    $scope.course = {
        "prefix": 1,
        "days": 1,
        "sections": [],
        "number": ""
    };

    $scope.prefixes = [{
        id: 1,
        name: "CS"
    }, {
        id: 2,
        name: "CE"
    }, {
        id: 3,
        name: "CM"
    }, {
        id: 4,
        name: "ME"
    },  {
        id: 5,
        name: "MA"
    }];

    $scope.days = [{
        id: 1,
        name: "MWF",
        daysArr: ["mon", "wed", "fri"]
    }, {
        id: 2,
        name: "TR",
        daysArr: ["tue", "thu"]
    }];

});
