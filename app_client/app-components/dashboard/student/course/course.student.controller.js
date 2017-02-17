/* jshint node: true */

//************************************************************
//  course.student.controller.js                            //
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

app.controller('Course.Student.Controller', function($scope, $localStorage, $window, $stateParams, $rootScope, UserService) {

    $rootScope.$stateParams = $stateParams;
    $scope.course = $localStorage.courses[$stateParams.selectedCourse];

    $scope.itemsPerPage = 3;
    $scope.currentLecturePage = 1;

    $scope.updateLecturePage = function(index) {
        $scope.currentLecturePage = index;
    };

    $scope.getPages = function(list, itemsPer) {
        var total = Math.ceil(list.length / itemsPer);
        var arr = [];
        for (var i = 0; i < total; i++) {
            arr.push(i);
        }
        return arr;
    };

    var w = angular.element($window);
    $scope.$watch(
        function() {
            return $window.innerWidth;
        },
        function(value) {
            $scope.windowWidth = value;
            if (value <= 1542) {
                $scope.itemsPerPage = 2;
            } else if (value > 1542 && value <= 2186) {
                $scope.itemsPerPage = 3;
            } else {
                $scope.itemsPerPage = 4;
            }
        },
        true
    );

    w.on('resize', function() {
        $scope.$apply();
    });

});
